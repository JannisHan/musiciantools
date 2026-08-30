export type ProductEventName =
  | 'tool_started'
  | 'calculation_completed'
  | 'tap_used'
  | 'value_copied'
  | 'share_clicked'

export type ProductEventDetail =
  | 'bpm_input'
  | 'tap_tempo'
  | 'device_limit'
  | 'ms_to_bpm'
  | 'bpm_changed'
  | 'tap_result'
  | 'provisional'
  | 'stable'
  | 'common_card'
  | 'full_table'
  | 'native_share'
  | 'link_copy'

type SendEvent = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export function createProductEventTracker(
  send: SendEvent = globalThis.fetch.bind(globalThis),
) {
  const sentEventNames = new Set<ProductEventName>()

  return {
    track(eventName: ProductEventName, detail: ProductEventDetail): void {
      if (sentEventNames.has(eventName)) return
      sentEventNames.add(eventName)

      void send('/api/events', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          eventName,
          toolId: 'bpm-delay-calculator',
          detail,
        }),
        keepalive: true,
      }).catch(() => undefined)
    },
  }
}
