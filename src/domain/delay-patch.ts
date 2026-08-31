import { calculateDelayRows, type TimingRow } from './timing'

export type DelayRecipeId =
  | 'slapback'
  | 'quarter-pulse'
  | 'dotted-eighth'
  | 'triplet-roll'
  | 'ambient'

export type OutputMode = 'mono' | 'stereo'
export type TimeSignature = '3-4' | '4-4' | '6-8'

export interface DelayRecipe {
  id: DelayRecipeId
  name: string
  character: string
  useCase: string
  leftTimingId: string
  rightTimingId: string
}

export interface DelayChannelResult {
  side: 'mono' | 'left' | 'right'
  timingId: string
  label: string
  milliseconds: number
  isAvailable: boolean
  alternative: TimingRow | null
}

export interface TimelineMarker {
  id: string
  channel: 'dry' | 'left' | 'right'
  milliseconds: number
  position: number
}

export interface DelayPatch {
  bpm: number
  meter: TimeSignature
  recipe: DelayRecipe
  output: OutputMode
  deviceMax?: number
  channels: DelayChannelResult[]
  ratio: string | null
  barDurationMs: number
  markers: TimelineMarker[]
}

export interface DelayPatchState {
  bpm: number
  meter: TimeSignature
  recipe: DelayRecipeId
  output: OutputMode
  deviceMax?: number
}

export const DELAY_RECIPES: DelayRecipe[] = [
  {
    id: 'slapback',
    name: 'Slapback',
    character: 'Tight & classic',
    useCase: 'Rockabilly depth without washing out the attack.',
    leftTimingId: '1/16-straight',
    rightTimingId: '1/16-dotted',
  },
  {
    id: 'quarter-pulse',
    name: 'Quarter Pulse',
    character: 'Wide & steady',
    useCase: 'A clear pulse for spacious riffs and melodic parts.',
    leftTimingId: '1/4-straight',
    rightTimingId: '1/8-straight',
  },
  {
    id: 'dotted-eighth',
    name: 'Dotted Eighth',
    character: 'Rhythmic lead',
    useCase: 'Syncopated repeats that turn eighth notes into a rolling pattern.',
    leftTimingId: '1/8-dotted',
    rightTimingId: '1/8-straight',
  },
  {
    id: 'triplet-roll',
    name: 'Triplet Roll',
    character: 'Elastic & restless',
    useCase: 'Triplet motion against a straight pulse for modern textures.',
    leftTimingId: '1/8-triplet',
    rightTimingId: '1/8-straight',
  },
  {
    id: 'ambient',
    name: 'Ambient',
    character: 'Long & open',
    useCase: 'Slow, overlapping repeats for swells and cinematic pads.',
    leftTimingId: '1/2-straight',
    rightTimingId: '1/4-dotted',
  },
]

export const DEFAULT_DELAY_PATCH_STATE: DelayPatchState = {
  bpm: 120,
  meter: '4-4',
  recipe: 'dotted-eighth',
  output: 'stereo',
  deviceMax: 400,
}

const METERS: TimeSignature[] = ['3-4', '4-4', '6-8']
const OUTPUTS: OutputMode[] = ['mono', 'stereo']

function greatestCommonDivisor(left: number, right: number): number {
  let a = Math.round(left * 1_000)
  let b = Math.round(right * 1_000)
  while (b !== 0) {
    const next = a % b
    a = b
    b = next
  }
  return a
}

function ratio(left: number, right: number): string {
  const divisor = greatestCommonDivisor(left, right)
  return `${Math.round((left * 1_000) / divisor)}:${Math.round((right * 1_000) / divisor)}`
}

function barDurationInQuarterNotes(meter: TimeSignature): number {
  if (meter === '3-4') return 3
  if (meter === '6-8') return 3
  return 4
}

function longestAvailableAlternative(
  rows: TimingRow[],
  deviceMax: number | undefined,
): TimingRow | null {
  if (deviceMax === undefined) return null
  return (
    rows
      .filter((row) => row.milliseconds <= deviceMax)
      .sort((left, right) => right.milliseconds - left.milliseconds)[0] ?? null
  )
}

function channel(
  side: DelayChannelResult['side'],
  row: TimingRow,
  alternative: TimingRow | null,
): DelayChannelResult {
  return {
    side,
    timingId: row.id,
    label: row.label,
    milliseconds: row.milliseconds,
    isAvailable: row.isAvailable,
    alternative: row.isAvailable ? null : alternative,
  }
}

function createMarkers(
  barDurationMs: number,
  channels: DelayChannelResult[],
): TimelineMarker[] {
  const markers: TimelineMarker[] = [
    { id: 'dry-0', channel: 'dry', milliseconds: 0, position: 0 },
  ]

  for (const result of channels) {
    const markerChannel = result.side === 'right' ? 'right' : 'left'
    for (
      let milliseconds = result.milliseconds;
      milliseconds < barDurationMs + 0.001;
      milliseconds += result.milliseconds
    ) {
      markers.push({
        id: `${markerChannel}-${milliseconds.toFixed(3)}`,
        channel: markerChannel,
        milliseconds,
        position: Math.min(milliseconds / barDurationMs, 1),
      })
    }
  }

  return markers
}

export function calculateDelayPatch(state: DelayPatchState): DelayPatch {
  const rows = calculateDelayRows(state.bpm, state.deviceMax)
  const recipe =
    DELAY_RECIPES.find((candidate) => candidate.id === state.recipe) ??
    DELAY_RECIPES[2]
  const leftRow = rows.find((row) => row.id === recipe.leftTimingId)
  const rightRow = rows.find((row) => row.id === recipe.rightTimingId)
  if (!leftRow || !rightRow) throw new Error('Delay recipe timing is missing.')

  const alternative = longestAvailableAlternative(rows, state.deviceMax)
  const channels =
    state.output === 'mono'
      ? [channel('mono', leftRow, alternative)]
      : [channel('left', leftRow, alternative), channel('right', rightRow, alternative)]
  const barDurationMs =
    (60_000 / state.bpm) * barDurationInQuarterNotes(state.meter)

  return {
    ...state,
    recipe,
    channels,
    ratio:
      state.output === 'stereo'
        ? ratio(leftRow.milliseconds, rightRow.milliseconds)
        : null,
    barDurationMs,
    markers: createMarkers(barDurationMs, channels),
  }
}

export function parseDelayPatchSearch(search: string): DelayPatchState {
  const params = new URLSearchParams(search)
  const bpm = Number(params.get('bpm'))
  const max = Number(params.get('max'))
  const meter = params.get('meter') as TimeSignature
  const recipe = params.get('recipe') as DelayRecipeId
  const output = params.get('output') as OutputMode

  return {
    bpm: Number.isFinite(bpm) && bpm >= 20 && bpm <= 400 ? bpm : 120,
    meter: METERS.includes(meter) ? meter : '4-4',
    recipe: DELAY_RECIPES.some((candidate) => candidate.id === recipe)
      ? recipe
      : 'dotted-eighth',
    output: OUTPUTS.includes(output) ? output : 'stereo',
    deviceMax: Number.isFinite(max) && max > 0 ? max : undefined,
  }
}

export function serializeDelayPatchState(state: DelayPatchState): string {
  const params = new URLSearchParams()
  params.set('bpm', Number(state.bpm.toFixed(1)).toString())
  params.set('meter', state.meter)
  params.set('recipe', state.recipe)
  params.set('output', state.output)
  if (state.deviceMax !== undefined) params.set('max', String(state.deviceMax))
  return params.toString()
}

export function formatDelayPatchForClipboard(patch: DelayPatch): string {
  const lines = [
    `${patch.recipe.name} delay patch`,
    `${patch.bpm.toFixed(1)} BPM · ${patch.meter.replace('-', '/')}`,
  ]
  for (const result of patch.channels) {
    const label = result.side === 'mono' ? 'Delay' : result.side === 'left' ? 'Left' : 'Right'
    lines.push(`${label}: ${result.milliseconds.toFixed(1)} ms (${result.label})`)
  }
  if (patch.ratio) lines.push(`Stereo relationship: ${patch.ratio}`)
  return lines.join('\n')
}
