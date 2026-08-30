export type TimingFeel = 'straight' | 'dotted' | 'triplet'

export interface TimingRow {
  id: string
  note: '1/1' | '1/2' | '1/4' | '1/8' | '1/16' | '1/32' | '1/64'
  label: string
  feel: TimingFeel
  milliseconds: number
  hertz: number
  isAvailable: boolean
}

const round = (value: number, decimals: number) => {
  const factor = 10 ** decimals
  return Math.round((value + Number.EPSILON) * factor) / factor
}

export function calculateDelayRows(
  bpm: number,
  deviceMaxDelayMs?: number,
): TimingRow[] {
  if (!Number.isFinite(bpm) || bpm < 20 || bpm > 400) {
    throw new RangeError('BPM must be between 20 and 400.')
  }

  const quarterNoteMs = 60_000 / bpm
  const notes = [
    { note: '1/1', name: 'Whole note', multiplier: 4 },
    { note: '1/2', name: 'Half note', multiplier: 2 },
    { note: '1/4', name: 'Quarter note', multiplier: 1 },
    { note: '1/8', name: 'Eighth note', multiplier: 0.5 },
    { note: '1/16', name: 'Sixteenth note', multiplier: 0.25 },
    { note: '1/32', name: 'Thirty-second note', multiplier: 0.125 },
    { note: '1/64', name: 'Sixty-fourth note', multiplier: 0.0625 },
  ] as const
  const feels = [
    { feel: 'straight', labelPrefix: '', multiplier: 1 },
    { feel: 'dotted', labelPrefix: 'Dotted ', multiplier: 1.5 },
    { feel: 'triplet', labelPrefix: '', multiplier: 2 / 3 },
  ] as const

  return notes.flatMap((noteDefinition) =>
    feels.map((feelDefinition) => {
      const milliseconds = round(
        quarterNoteMs *
          noteDefinition.multiplier *
          feelDefinition.multiplier,
        3,
      )
      const tripletSuffix =
        feelDefinition.feel === 'triplet' ? ' triplet' : ''
      const baseName = noteDefinition.name.toLowerCase()
      const label =
        feelDefinition.feel === 'straight'
          ? noteDefinition.name
          : feelDefinition.feel === 'dotted'
            ? `Dotted ${baseName}`
            : `${noteDefinition.name}${tripletSuffix}`

      return {
        id: `${noteDefinition.note}-${feelDefinition.feel}`,
        note: noteDefinition.note,
        label,
        feel: feelDefinition.feel,
        milliseconds,
        hertz: round(1_000 / milliseconds, 3),
        isAvailable:
          deviceMaxDelayMs === undefined ||
          milliseconds <= deviceMaxDelayMs,
      }
    }),
  )
}

export function bpmFromQuarterNoteMs(milliseconds: number): number {
  if (!Number.isFinite(milliseconds) || milliseconds <= 0) {
    throw new RangeError(
      'Quarter-note duration must be a positive finite number.',
    )
  }

  return round(60_000 / milliseconds, 1)
}
