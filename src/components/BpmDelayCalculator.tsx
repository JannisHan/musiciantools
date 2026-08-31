import {
  ArrowRight,
  CheckCircle,
  ClockCountdown,
  ClipboardText,
  Cloud,
  Copy,
  LinkSimple,
  MusicNotes,
  Play,
  Pulse,
  SlidersHorizontal,
  SpeakerHigh,
  Stop,
  WarningCircle,
  WaveSine,
  Waveform,
} from '@phosphor-icons/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import { OneBarAudioPreview } from '../domain/audio-preview'
import {
  calculateDelayPatch,
  DELAY_RECIPES,
  formatDelayPatchForClipboard,
  parseDelayPatchSearch,
  serializeDelayPatchState,
  type DelayPatchState,
  type DelayRecipeId,
  type OutputMode,
  type TimeSignature,
} from '../domain/delay-patch'
import { TapTempo, type TapTempoResult } from '../domain/tap-tempo'
import {
  bpmFromQuarterNoteMs,
  calculateDelayRows,
  type TimingFeel,
} from '../domain/timing'
import { writeTextToClipboard } from '../lib/browser-actions'
import { createProductEventTracker } from '../lib/product-events'

const FEELS: TimingFeel[] = ['straight', 'dotted', 'triplet']
const METERS: Array<{ id: TimeSignature; label: string }> = [
  { id: '3-4', label: '3/4' },
  { id: '4-4', label: '4/4' },
  { id: '6-8', label: '6/8' },
]

function formatMilliseconds(value: number): string {
  return value >= 100
    ? value.toFixed(1)
    : value >= 10
      ? value.toFixed(2)
      : value.toFixed(3)
}

function isValidBpm(value: number): boolean {
  return Number.isFinite(value) && value >= 20 && value <= 400
}

function SideBadge({ side }: { side: 'mono' | 'left' | 'right' }) {
  return (
    <span className={`channel-badge channel-${side}`}>
      {side === 'mono' ? 'Mono' : side === 'left' ? 'Left' : 'Right'}
    </span>
  )
}

function RecipeIcon({ id }: { id: DelayRecipeId }) {
  const Icon =
    id === 'slapback'
      ? MusicNotes
      : id === 'quarter-pulse'
        ? Pulse
        : id === 'dotted-eighth'
          ? ClockCountdown
          : id === 'triplet-roll'
            ? WaveSine
            : Cloud
  return <Icon className="recipe-icon" size={23} weight="duotone" aria-hidden="true" />
}

export default function BpmDelayCalculator() {
  const [hydrated, setHydrated] = useState(false)
  const [state, setState] = useState<DelayPatchState>({
    bpm: 120,
    meter: '4-4',
    recipe: 'dotted-eighth',
    output: 'stereo',
    deviceMax: 400,
  })
  const [bpmInput, setBpmInput] = useState('120.0')
  const [maxInput, setMaxInput] = useState('400')
  const [quarterNoteInput, setQuarterNoteInput] = useState('500')
  const [enabledFeels, setEnabledFeels] = useState<Set<TimingFeel>>(
    () => new Set(FEELS),
  )
  const [tapResult, setTapResult] = useState<TapTempoResult>({
    bpm: null,
    status: 'waiting',
    intervalCount: 0,
    didReset: false,
  })
  const [status, setStatus] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const tapTempo = useRef(new TapTempo())
  const audioPreview = useRef<OneBarAudioPreview | null>(null)
  const playTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const tracker = useRef(createProductEventTracker('bpm-delay-calculator'))

  useEffect(() => {
    const shared = parseDelayPatchSearch(window.location.search)
    setState(shared)
    setBpmInput(shared.bpm.toFixed(1))
    setMaxInput(
      shared.deviceMax === undefined ? '' : String(shared.deviceMax),
    )
    setQuarterNoteInput((60_000 / shared.bpm).toFixed(1))
    setHydrated(true)
    return () => {
      audioPreview.current?.stop()
      if (playTimer.current !== null) clearTimeout(playTimer.current)
    }
  }, [])

  useEffect(() => {
    if (!status) return
    const timer = window.setTimeout(() => setStatus(''), 4_000)
    return () => window.clearTimeout(timer)
  }, [status])

  const patch = useMemo(() => calculateDelayPatch(state), [state])
  const rows = useMemo(
    () => calculateDelayRows(state.bpm, state.deviceMax),
    [state.bpm, state.deviceMax],
  )
  const filteredRows = rows.filter((row) => enabledFeels.has(row.feel))
  const beatCount =
    state.meter === '6-8' ? 6 : Number(state.meter.split('-')[0])

  function setBpm(
    value: string,
    detail: 'bpm_input' | 'tap_tempo' | 'ms_to_bpm' = 'bpm_input',
  ) {
    setBpmInput(value)
    const bpm = Number(value)
    tracker.current.track('tool_started', detail)
    if (isValidBpm(bpm)) {
      setState((current) => ({ ...current, bpm }))
      setQuarterNoteInput((60_000 / bpm).toFixed(1))
      tracker.current.track(
        'calculation_completed',
        detail === 'tap_tempo'
          ? 'tap_result'
          : detail === 'ms_to_bpm'
            ? 'ms_to_bpm'
            : 'bpm_changed',
      )
    }
  }

  function handleTap() {
    const result = tapTempo.current.tap(performance.now())
    setTapResult(result)
    if (result.bpm !== null && isValidBpm(result.bpm)) {
      setBpm(result.bpm.toFixed(1), 'tap_tempo')
      tracker.current.track(
        'tap_used',
        result.status === 'stable' ? 'stable' : 'provisional',
      )
    }
  }

  function chooseRecipe(recipe: DelayRecipeId) {
    setState((current) => ({ ...current, recipe }))
    tracker.current.track('calculation_completed', 'recipe_changed')
  }

  function chooseOutput(output: OutputMode) {
    setState((current) => ({ ...current, output }))
    tracker.current.track('tool_started', 'output_changed')
  }

  function updateDeviceMax(value: string) {
    setMaxInput(value)
    const max = Number(value)
    setState((current) => ({
      ...current,
      deviceMax:
        value === '' || !Number.isFinite(max) || max <= 0 ? undefined : max,
    }))
    tracker.current.track('tool_started', 'device_limit')
  }

  async function copyPatch() {
    try {
      await writeTextToClipboard(formatDelayPatchForClipboard(patch))
      setStatus('Patch copied.')
      tracker.current.track('value_copied', 'patch_copy')
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

  async function sharePatch() {
    const url = new URL(window.location.href)
    url.search = serializeDelayPatchState(state)
    try {
      await writeTextToClipboard(url.toString())
      window.history.replaceState(
        {},
        '',
        `${url.pathname}?${url.searchParams.toString()}`,
      )
      setStatus('Share link copied.')
      tracker.current.track('share_clicked', 'link_copy')
    } catch {
      setStatus('Clipboard access is unavailable in this browser.')
    }
  }

  async function previewPattern() {
    if (isPlaying) {
      audioPreview.current?.stop()
      setIsPlaying(false)
      return
    }
    audioPreview.current ??= new OneBarAudioPreview()
    const duration = await audioPreview.current.play(patch)
    setIsPlaying(true)
    tracker.current.track('audio_previewed', 'pattern_preview')
    playTimer.current = setTimeout(() => setIsPlaying(false), duration)
  }

  function convertQuarterNote() {
    const milliseconds = Number(quarterNoteInput)
    if (!Number.isFinite(milliseconds) || milliseconds <= 0) return
    const bpm = bpmFromQuarterNoteMs(milliseconds)
    if (isValidBpm(bpm)) setBpm(bpm.toFixed(1), 'ms_to_bpm')
  }

  const bpmError = isValidBpm(Number(bpmInput))
    ? ''
    : 'Enter a BPM from 20 to 400.'
  const tapLabel =
    tapResult.bpm === null
      ? 'Tap tempo'
      : `${tapResult.bpm.toFixed(1)} BPM · ${tapResult.status}`

  return (
    <section
      className="patch-builder"
      data-hydrated={hydrated ? 'true' : 'false'}
      aria-label="Delay patch builder"
    >
      <div className="builder-step tempo-step">
        <div className="step-heading">
          <span>1</span>
          <div>
            <p className="step-kicker">Tempo</p>
            <h2>Set the song pulse</h2>
          </div>
        </div>
        <div className="tempo-row">
          <label className="compact-number-field" htmlFor="bpm">
            <span className="sr-only">Tempo</span>
            <input
              id="bpm"
              type="number"
              min="20"
              max="400"
              step="0.1"
              inputMode="decimal"
              value={bpmInput}
              onChange={(event) => setBpm(event.target.value)}
              aria-invalid={bpmError !== ''}
            />
            <strong>BPM</strong>
          </label>
          <button type="button" className="tap-compact" onClick={handleTap} aria-label={tapLabel}>
            <Waveform size={20} weight="bold" />
            <span aria-hidden="true">Tap</span>
          </button>
        </div>
        {bpmError ? <p className="field-error">{bpmError}</p> : null}
        <div className="meter-row" aria-label="Time signature">
          {METERS.map((meter) => (
            <button
              key={meter.id}
              type="button"
              className={
                state.meter === meter.id
                  ? 'choice-chip is-selected'
                  : 'choice-chip'
              }
              onClick={() =>
                setState((current) => ({ ...current, meter: meter.id }))
              }
            >
              {meter.label}
            </button>
          ))}
        </div>
      </div>

      <section className="patch-result" aria-live="polite">
        <div className="patch-result-heading">
          <div>
            <p className="eyebrow">Your delay patch</p>
            <h2>{patch.recipe.name}</h2>
            <p>{patch.recipe.character}</p>
          </div>
          <SlidersHorizontal size={28} weight="duotone" aria-hidden="true" />
        </div>
        <div
          className={`channel-grid ${state.output === 'mono' ? 'is-mono' : ''}`}
        >
          {patch.channels.map((result) => (
            <article
              className={`channel-card channel-card-${result.side}`}
              key={result.side}
            >
              <div className="channel-topline">
                <SideBadge side={result.side} />
                {result.isAvailable ? (
                  <span className="compatibility is-compatible">
                    <CheckCircle size={16} weight="fill" />
                    Fits
                  </span>
                ) : (
                  <span className="compatibility is-over">
                    <WarningCircle size={16} weight="fill" />
                    Over max
                  </span>
                )}
              </div>
              <p className="channel-time">
                {formatMilliseconds(result.milliseconds)}
                <span>ms</span>
              </p>
              <p className="channel-note">{result.label}</p>
              {!result.isAvailable && result.alternative ? (
                <p className="alternative">
                  Try {result.alternative.label} ·{' '}
                  {formatMilliseconds(result.alternative.milliseconds)} ms
                </p>
              ) : null}
            </article>
          ))}
        </div>
        {patch.ratio ? (
          <p className="ratio-line">
            Stereo relationship <strong>{patch.ratio}</strong>
          </p>
        ) : null}
        <div className="timeline-card">
          <div className="timeline-heading">
            <div>
              <p>One-bar echo pattern</p>
              <span>
                {state.meter.replace('-', '/')} · dry attack plus repeat taps
              </span>
            </div>
            <button
              type="button"
              className="preview-button"
              onClick={previewPattern}
            >
              {isPlaying ? (
                <Stop size={18} weight="fill" />
              ) : (
                <Play size={18} weight="fill" />
              )}
              {isPlaying ? 'Stop' : 'Preview pattern'}
            </button>
          </div>
          <div className="timeline" aria-label="One bar delay timeline">
            {Array.from({ length: beatCount + 1 }, (_, index) => (
              <span
                key={`beat-${index}`}
                className="beat-line"
                style={{ left: `${(index / beatCount) * 100}%` }}
              />
            ))}
            {patch.markers.map((marker) => (
              <span
                key={marker.id}
                className={`timeline-marker marker-${marker.channel}`}
                style={{ left: `${marker.position * 100}%` }}
                title={`${marker.channel} ${formatMilliseconds(marker.milliseconds)} ms`}
              />
            ))}
          </div>
          <div className="timeline-legend">
            <span><i className="legend-dry" />Dry</span>
            <span><i className="legend-left" />Left / Mono</span>
            {state.output === 'stereo' ? (
              <span><i className="legend-right" />Right</span>
            ) : null}
          </div>
        </div>
        <div className="patch-actions">
          <button type="button" className="primary-button" onClick={copyPatch}>
            <ClipboardText size={19} />
            Copy patch
          </button>
          <button
            type="button"
            className="secondary-button"
            onClick={sharePatch}
          >
            <LinkSimple size={19} />
            Share
          </button>
        </div>
        <p className="screen-status" aria-live="polite">{status}</p>
      </section>

      <div className="builder-step rhythm-step">
        <div className="step-heading">
          <span>2</span>
          <div>
            <p className="step-kicker">Rhythm</p>
            <h2>Choose the repeat character</h2>
          </div>
        </div>
        <div className="recipe-list">
          {DELAY_RECIPES.map((recipe) => (
            <button
              key={recipe.id}
              type="button"
              className={
                state.recipe === recipe.id
                  ? 'recipe-option is-selected'
                  : 'recipe-option'
              }
              onClick={() => chooseRecipe(recipe.id)}
            >
              <RecipeIcon id={recipe.id} />
              <span>
                <strong>{recipe.name}</strong>
                <small>{recipe.character}</small>
              </span>
              <span className="recipe-description">{recipe.useCase}</span>
              <ArrowRight size={18} weight="bold" />
            </button>
          ))}
        </div>
      </div>

      <div className="builder-step output-step">
        <div className="step-heading">
          <span>3</span>
          <div>
            <p className="step-kicker">Output</p>
            <h2>Match your pedal</h2>
          </div>
        </div>
        <div className="segmented-control" aria-label="Output mode">
          {(['mono', 'stereo'] as OutputMode[]).map((output) => (
            <button
              key={output}
              type="button"
              className={state.output === output ? 'is-selected' : ''}
              onClick={() => chooseOutput(output)}
            >
              {output === 'mono' ? (
                <SpeakerHigh size={18} />
              ) : (
                <Waveform size={18} />
              )}
              {output}
            </button>
          ))}
        </div>
        <label className="stacked-field" htmlFor="device-max">
          <span>Maximum delay <small>Optional</small></span>
          <div>
            <input
              id="device-max"
              type="number"
              min="1"
              step="1"
              inputMode="numeric"
              placeholder="e.g. 2000"
              value={maxInput}
              onChange={(event) => updateDeviceMax(event.target.value)}
            />
            <strong>ms</strong>
          </div>
        </label>
      </div>

      <details className="reference-panel">
        <summary>Reference table & reverse converter</summary>
        <div className="reference-toolbar">
          <div className="feel-filters">
            {FEELS.map((feel) => (
              <label key={feel}>
                <input
                  type="checkbox"
                  checked={enabledFeels.has(feel)}
                  onChange={() =>
                    setEnabledFeels((current) => {
                      const next = new Set(current)
                      if (next.has(feel) && next.size > 1) next.delete(feel)
                      else next.add(feel)
                      return next
                    })
                  }
                />
                <span>{feel}</span>
              </label>
            ))}
          </div>
          <div className="reverse-inline">
            <label htmlFor="quarter-note-ms">Quarter-note ms</label>
            <input
              id="quarter-note-ms"
              type="number"
              min="150"
              max="3000"
              step="0.1"
              value={quarterNoteInput}
              onChange={(event) => setQuarterNoteInput(event.target.value)}
            />
            <button type="button" onClick={convertQuarterNote}>Use BPM</button>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Complete BPM to milliseconds and hertz table
            </caption>
            <thead>
              <tr>
                <th>Note</th><th>Feel</th><th>Time</th><th>Rate</th>
                <th>Device</th><th><span className="sr-only">Copy</span></th>
              </tr>
            </thead>
            <tbody>
              {filteredRows.map((row) => (
                <tr key={row.id} className={row.isAvailable ? '' : 'is-over'}>
                  <th>{row.note}</th>
                  <td>{row.feel}</td>
                  <td className="mono-cell">{formatMilliseconds(row.milliseconds)} ms</td>
                  <td className="mono-cell">{row.hertz.toFixed(3)} Hz</td>
                  <td>{row.isAvailable ? 'In range' : 'Over max'}</td>
                  <td>
                    <button
                      type="button"
                      className="icon-button"
                      aria-label={`Copy ${formatMilliseconds(row.milliseconds)} milliseconds`}
                      onClick={() =>
                        void writeTextToClipboard(
                          `${formatMilliseconds(row.milliseconds)} ms`,
                        )
                      }
                    >
                      <Copy size={17} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </section>
  )
}
