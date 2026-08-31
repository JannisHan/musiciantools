import { describe, expect, it } from 'vitest'
import { calculateDelayPatch } from './delay-patch'
import { createAudioPreviewSchedule } from './audio-preview'

describe('one-bar audio preview schedule', () => {
  it('contains no events beyond the selected bar', () => {
    const patch = calculateDelayPatch({ bpm: 120, meter: '3-4', recipe: 'dotted-eighth', output: 'stereo' })
    const schedule = createAudioPreviewSchedule(patch)
    expect(schedule.durationSeconds).toBe(1.5)
    expect(schedule.events[0]).toEqual({ channel: 'dry', atSeconds: 0, gain: 0.42 })
    expect(Math.max(...schedule.events.map((event) => event.atSeconds))).toBeLessThanOrEqual(1.5)
  })
})
