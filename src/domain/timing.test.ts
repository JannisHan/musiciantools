import { describe, expect, it } from 'vitest'
import { bpmFromQuarterNoteMs, calculateDelayRows } from './timing'

describe('tempo timing calculations', () => {
  it('returns the expected common timings at 120 BPM', () => {
    const rows = calculateDelayRows(120)

    expect(rows.find((row) => row.id === '1/4-straight')?.milliseconds).toBe(
      500,
    )
    expect(rows.find((row) => row.id === '1/8-dotted')?.milliseconds).toBe(375)
    expect(
      rows.find((row) => row.id === '1/8-triplet')?.milliseconds,
    ).toBeCloseTo(166.667, 3)
  })

  it('converts quarter-note duration back to BPM', () => {
    expect(bpmFromQuarterNoteMs(500)).toBe(120)
  })

  it('returns every subdivision in a fixed whole-to-sixty-fourth order', () => {
    const rows = calculateDelayRows(120)

    expect(rows).toHaveLength(21)
    expect(rows.slice(0, 3).map((row) => row.id)).toEqual([
      '1/1-straight',
      '1/1-dotted',
      '1/1-triplet',
    ])
    expect(rows.at(-1)?.id).toBe('1/64-triplet')
  })

  it('marks timings beyond an optional device maximum without hiding them', () => {
    const rows = calculateDelayRows(120, 400)

    expect(rows.find((row) => row.id === '1/4-straight')?.isAvailable).toBe(
      false,
    )
    expect(rows.find((row) => row.id === '1/8-dotted')?.isAvailable).toBe(true)
  })

  it('enforces the product BPM range', () => {
    expect(() => calculateDelayRows(19.9)).toThrow(RangeError)
    expect(() => calculateDelayRows(400.1)).toThrow(RangeError)
  })
})
