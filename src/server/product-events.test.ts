import { describe, expect, it, vi } from 'vitest'
import { handleProductEventRequest } from './product-events'

describe('POST /api/events', () => {
  it('writes one whitelisted anonymous event in the documented column order', async () => {
    const writeDataPoint = vi.fn()
    const request = new Request('https://musiciantools.app/api/events', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        eventName: 'tool_started',
        toolId: 'bpm-delay-calculator',
        detail: 'bpm_input',
      }),
    })

    const response = await handleProductEventRequest(request, {
      writeDataPoint,
    })

    expect(response.status).toBe(204)
    expect(writeDataPoint).toHaveBeenCalledWith({
      blobs: [
        '1',
        'tool_started',
        'bpm-delay-calculator',
        'bpm_input',
      ],
      doubles: [1],
      indexes: ['bpm-delay-calculator'],
    })
  })

  it.each([
    {
      eventName: 'unknown_event',
      toolId: 'bpm-delay-calculator',
      detail: 'bpm_input',
    },
    {
      eventName: 'tool_started',
      toolId: 'unknown-tool',
      detail: 'bpm_input',
    },
    {
      eventName: 'tool_started',
      toolId: 'bpm-delay-calculator',
      detail: 'raw user text',
    },
    {
      eventName: 'tool_started',
      toolId: 'bpm-delay-calculator',
      detail: 'bpm_input',
      bpm: 120,
    },
  ])('rejects unknown enums and additional raw-input fields', async (body) => {
    const writeDataPoint = vi.fn()
    const response = await handleProductEventRequest(
      new Request('https://musiciantools.app/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      }),
      { writeDataPoint },
    )

    expect(response.status).toBe(400)
    expect(writeDataPoint).not.toHaveBeenCalled()
  })

  it('rejects non-JSON requests', async () => {
    const response = await handleProductEventRequest(
      new Request('https://musiciantools.app/api/events', {
        method: 'POST',
        headers: { 'content-type': 'text/plain' },
        body: 'tool_started',
      }),
      { writeDataPoint: vi.fn() },
    )

    expect(response.status).toBe(415)
  })

  it('accepts the fret calculator export enum without raw dimensions', async () => {
    const writeDataPoint = vi.fn()
    const response = await handleProductEventRequest(
      new Request('https://musiciantools.app/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          eventName: 'export_created',
          toolId: 'fret-calculator',
          detail: 'pdf_export',
        }),
      }),
      { writeDataPoint },
    )

    expect(response.status).toBe(204)
  })
})
