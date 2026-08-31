import { describe, expect, it } from 'vitest'
import {
  calculateDelayPatch,
  parseDelayPatchSearch,
  serializeDelayPatchState,
  type DelayRecipeId,
} from './delay-patch'

describe('delay patch builder', () => {
  it.each([
    ['slapback', 125, 187.5],
    ['quarter-pulse', 500, 250],
    ['dotted-eighth', 375, 250],
    ['triplet-roll', 166.667, 250],
    ['ambient', 1000, 750],
  ] satisfies Array<[DelayRecipeId, number, number]>) (
    'builds the %s stereo recipe at 120 BPM',
    (recipe, left, right) => {
      const patch = calculateDelayPatch({
        bpm: 120,
        meter: '4-4',
        recipe,
        output: 'stereo',
      })
      expect(patch.channels[0].milliseconds).toBeCloseTo(left, 3)
      expect(patch.channels[1].milliseconds).toBeCloseTo(right, 3)
    },
  )

  it('returns the expected dotted-eighth relationship and one-bar markers', () => {
    const patch = calculateDelayPatch({
      bpm: 120,
      meter: '4-4',
      recipe: 'dotted-eighth',
      output: 'stereo',
      deviceMax: 400,
    })

    expect(patch.ratio).toBe('3:2')
    expect(patch.barDurationMs).toBe(2000)
    expect(patch.markers.filter((marker) => marker.channel === 'left')).toHaveLength(5)
    expect(patch.markers.filter((marker) => marker.channel === 'right')).toHaveLength(8)
  })

  it('reports per-channel device compatibility and a usable alternative', () => {
    const patch = calculateDelayPatch({
      bpm: 120,
      meter: '4-4',
      recipe: 'dotted-eighth',
      output: 'stereo',
      deviceMax: 300,
    })

    expect(patch.channels[0].isAvailable).toBe(false)
    expect(patch.channels[0].alternative?.milliseconds).toBe(250)
    expect(patch.channels[1].isAvailable).toBe(true)
  })

  it('round-trips URL state and sanitizes invalid values', () => {
    const search = serializeDelayPatchState({
      bpm: 92.5,
      meter: '6-8',
      recipe: 'ambient',
      output: 'mono',
      deviceMax: 800,
    })
    expect(parseDelayPatchSearch(search)).toEqual({
      bpm: 92.5,
      meter: '6-8',
      recipe: 'ambient',
      output: 'mono',
      deviceMax: 800,
    })
    expect(parseDelayPatchSearch('?bpm=999&meter=9-9&recipe=nope&output=quad')).toEqual({
      bpm: 120,
      meter: '4-4',
      recipe: 'dotted-eighth',
      output: 'stereo',
      deviceMax: undefined,
    })
  })
})
