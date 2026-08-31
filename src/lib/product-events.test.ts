import { describe, expect, it, vi } from 'vitest'
import { createProductEventTracker } from './product-events'

describe('product event tracker', () => {
  it('sends each event type at most once per page lifetime', async () => {
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    const tracker = createProductEventTracker('bpm-delay-calculator', send)

    tracker.track('tool_started', 'bpm_input')
    tracker.track('tool_started', 'tap_tempo')
    tracker.track('value_copied', 'common_card')
    await Promise.resolve()

    expect(send).toHaveBeenCalledTimes(2)
    expect(JSON.parse(String(send.mock.calls[0][1]?.body))).toEqual({
      eventName: 'tool_started',
      toolId: 'bpm-delay-calculator',
      detail: 'bpm_input',
    })
  })

  it('uses the selected tool id without including raw calculator values', async () => {
    const send = vi.fn().mockResolvedValue(new Response(null, { status: 204 }))
    const tracker = createProductEventTracker('fret-calculator', send)

    tracker.track('export_created', 'pdf_export')
    await Promise.resolve()

    expect(JSON.parse(String(send.mock.calls[0][1]?.body))).toEqual({
      eventName: 'export_created',
      toolId: 'fret-calculator',
      detail: 'pdf_export',
    })
  })
})
