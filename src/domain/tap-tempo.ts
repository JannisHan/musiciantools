export type TapTempoStatus = 'waiting' | 'provisional' | 'stable' | 'unstable'

export interface TapTempoResult {
  bpm: number | null
  status: TapTempoStatus
  intervalCount: number
  didReset: boolean
}

const MAX_INTERVALS = 8
const FIRST_INTERVAL_LIMIT_MS = 4_000
const MIN_RESET_MS = 2_000
const MAX_RESET_MS = 5_000

const roundToOneDecimal = (value: number) =>
  Math.round((value + Number.EPSILON) * 10) / 10

function median(values: number[]): number {
  const sorted = [...values].sort((left, right) => left - right)
  const middle = Math.floor(sorted.length / 2)

  return sorted.length % 2 === 0
    ? (sorted[middle - 1] + sorted[middle]) / 2
    : sorted[middle]
}

function clamp(value: number, minimum: number, maximum: number): number {
  return Math.min(Math.max(value, minimum), maximum)
}

export class TapTempo {
  private lastTimestampMs: number | null = null
  private intervalsMs: number[] = []

  tap(timestampMs: number): TapTempoResult {
    if (!Number.isFinite(timestampMs)) {
      throw new RangeError('Tap timestamp must be a finite number.')
    }

    if (this.lastTimestampMs === null) {
      this.lastTimestampMs = timestampMs
      return this.result(false)
    }

    const intervalMs = timestampMs - this.lastTimestampMs
    if (intervalMs <= 0) {
      throw new RangeError('Tap timestamps must increase.')
    }

    const resetAfterMs =
      this.intervalsMs.length === 0
        ? FIRST_INTERVAL_LIMIT_MS
        : clamp(
            median(this.filteredIntervals()) * 2.5,
            MIN_RESET_MS,
            MAX_RESET_MS,
          )

    if (intervalMs > resetAfterMs) {
      this.intervalsMs = []
      this.lastTimestampMs = timestampMs
      return this.result(true)
    }

    this.intervalsMs.push(intervalMs)
    this.intervalsMs = this.intervalsMs.slice(-MAX_INTERVALS)
    this.lastTimestampMs = timestampMs

    return this.result(false)
  }

  reset(): TapTempoResult {
    this.lastTimestampMs = null
    this.intervalsMs = []
    return this.result(false)
  }

  private filteredIntervals(): number[] {
    if (this.intervalsMs.length < 3) {
      return [...this.intervalsMs]
    }

    const center = median(this.intervalsMs)
    const filtered = this.intervalsMs.filter(
      (interval) => interval >= center * 0.65 && interval <= center * 1.5,
    )

    return filtered.length > 0 ? filtered : [...this.intervalsMs]
  }

  private result(didReset: boolean): TapTempoResult {
    if (this.intervalsMs.length === 0) {
      return {
        bpm: null,
        status: 'waiting',
        intervalCount: 0,
        didReset,
      }
    }

    const filtered = this.filteredIntervals()
    const average =
      filtered.reduce((total, interval) => total + interval, 0) /
      filtered.length
    const bpm = roundToOneDecimal(60_000 / average)

    if (this.intervalsMs.length === 1) {
      return {
        bpm,
        status: 'provisional',
        intervalCount: 1,
        didReset,
      }
    }

    const center = median(filtered)
    const maximumDeviation = Math.max(
      ...filtered.map((interval) => Math.abs(interval - center) / center),
    )

    return {
      bpm,
      status: maximumDeviation <= 0.04 ? 'stable' : 'unstable',
      intervalCount: this.intervalsMs.length,
      didReset,
    }
  }
}
