const MAX_EVENT_BODY_BYTES = 1_024
const SCHEMA_VERSION = '1'

const EVENT_NAMES = new Set([
  'tool_started',
  'calculation_completed',
  'tap_used',
  'audio_previewed',
  'value_copied',
  'share_clicked',
  'export_created',
])

const TOOL_IDS = new Set(['bpm-delay-calculator', 'fret-calculator'])

const EVENT_DETAILS = new Set([
  'bpm_input',
  'tap_tempo',
  'device_limit',
  'ms_to_bpm',
  'bpm_changed',
  'tap_result',
  'provisional',
  'stable',
  'common_card',
  'full_table',
  'native_share',
  'link_copy',
  'recipe_changed',
  'output_changed',
  'pattern_preview',
  'patch_copy',
  'preset_changed',
  'custom_scale',
  'fret_count_changed',
  'unit_changed',
  'csv_export',
  'svg_export',
  'pdf_export',
  'none',
])

const ALLOWED_FIELDS = new Set(['eventName', 'toolId', 'detail'])

interface AnalyticsDataPoint {
  blobs: string[]
  doubles: number[]
  indexes: string[]
}

export interface AnalyticsWriter {
  writeDataPoint(dataPoint: AnalyticsDataPoint): void
}

interface ProductEvent {
  eventName: string
  toolId: string
  detail: string
}

function errorResponse(status: number, error: string): Response {
  return Response.json(
    { error },
    {
      status,
      headers: {
        'cache-control': 'no-store',
      },
    },
  )
}

async function readBoundedJson(request: Request): Promise<unknown> {
  if (request.body === null) throw new Error('Missing request body.')

  const reader = request.body.getReader()
  const decoder = new TextDecoder()
  let totalBytes = 0
  let text = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    totalBytes += value.byteLength

    if (totalBytes > MAX_EVENT_BODY_BYTES) {
      await reader.cancel('Event body too large.')
      throw new RangeError('Event body too large.')
    }
    text += decoder.decode(value, { stream: true })
  }

  text += decoder.decode()
  return JSON.parse(text)
}

function parseProductEvent(value: unknown): ProductEvent | null {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return null
  }

  const fields = Object.keys(value)
  if (
    fields.length < 2 ||
    fields.some((field) => !ALLOWED_FIELDS.has(field))
  ) {
    return null
  }

  const eventName = Reflect.get(value, 'eventName')
  const toolId = Reflect.get(value, 'toolId')
  const detail = Reflect.get(value, 'detail') ?? 'none'

  if (
    typeof eventName !== 'string' ||
    !EVENT_NAMES.has(eventName) ||
    typeof toolId !== 'string' ||
    !TOOL_IDS.has(toolId) ||
    typeof detail !== 'string' ||
    !EVENT_DETAILS.has(detail)
  ) {
    return null
  }

  return { eventName, toolId, detail }
}

export async function handleProductEventRequest(
  request: Request,
  analytics: AnalyticsWriter,
): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(null, {
      status: 405,
      headers: { allow: 'POST', 'cache-control': 'no-store' },
    })
  }

  const contentType = request.headers.get('content-type') ?? ''
  if (!contentType.toLowerCase().startsWith('application/json')) {
    return errorResponse(415, 'Expected application/json.')
  }

  try {
    const parsed = parseProductEvent(await readBoundedJson(request))
    if (parsed === null) return errorResponse(400, 'Invalid event.')

    analytics.writeDataPoint({
      blobs: [
        SCHEMA_VERSION,
        parsed.eventName,
        parsed.toolId,
        parsed.detail,
      ],
      doubles: [1],
      indexes: [parsed.toolId],
    })

    return new Response(null, {
      status: 204,
      headers: { 'cache-control': 'no-store' },
    })
  } catch (error) {
    if (error instanceof RangeError) {
      return errorResponse(413, 'Event body too large.')
    }
    return errorResponse(400, 'Invalid JSON.')
  }
}
