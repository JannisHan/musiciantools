export type ProductEventName =
  | 'tool_started'
  | 'calculation_completed'
  | 'tap_used'
  | 'audio_previewed'
  | 'value_copied'
  | 'share_clicked'
  | 'export_created'

export type ProductToolId = 'bpm-delay-calculator' | 'fret-calculator'

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
  | 'recipe_changed'
  | 'output_changed'
  | 'pattern_preview'
  | 'patch_copy'
  | 'preset_changed'
  | 'custom_scale'
  | 'fret_count_changed'
  | 'unit_changed'
  | 'template_geometry_changed'
  | 'template_extent_changed'
  | 'csv_export'
  | 'svg_export'
  | 'pdf_export'

type SendEvent = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>

export function createProductEventTracker(
  toolId: ProductToolId = 'bpm-delay-calculator',
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
          toolId,
          detail,
        }),
        keepalive: true,
      }).catch(() => undefined)
    },
  }
}
