import { describe, expect, it } from 'vitest'
import { TapTempo } from './tap-tempo'

describe('TapTempo', () => {
  it('shows a provisional BPM on the second tap and stability from the third', () => {
    const tracker = new TapTempo()

    expect(tracker.tap(0).status).toBe('waiting')
    expect(tracker.tap(500)).toMatchObject({
      bpm: 120,
      status: 'provisional',
    })
    expect(tracker.tap(1_000)).toMatchObject({
      bpm: 120,
      status: 'stable',
    })
  })

  it('allows the three-second first interval required for 20 BPM', () => {
    const tracker = new TapTempo()

    tracker.tap(0)
    expect(tracker.tap(3_000)).toMatchObject({
      bpm: 20,
      status: 'provisional',
    })
  })

  it('filters one obvious timing outlier and keeps the recent eight intervals', () => {
    const tracker = new TapTempo()
    const timestamps = [
      0, 500, 1_000, 1_500, 2_500, 3_000, 3_500, 4_000, 4_500, 5_000,
      5_500,
    ]

    let result = tracker.tap(timestamps[0])
    for (const timestamp of timestamps.slice(1)) {
      result = tracker.tap(timestamp)
    }

    expect(result.bpm).toBe(120)
    expect(result.intervalCount).toBe(8)
    expect(result.status).toBe('stable')
  })

  it('uses an adaptive reset threshold clamped between two and five seconds', () => {
    const tracker = new TapTempo()

    tracker.tap(0)
    tracker.tap(500)
    tracker.tap(1_000)
    const restarted = tracker.tap(3_001)

    expect(restarted).toMatchObject({
      bpm: null,
      intervalCount: 0,
      status: 'waiting',
      didReset: true,
    })
  })

  it('supports an explicit reset', () => {
    const tracker = new TapTempo()
    tracker.tap(0)
    tracker.tap(500)

    expect(tracker.reset()).toMatchObject({
      bpm: null,
      intervalCount: 0,
      status: 'waiting',
    })
  })
})
