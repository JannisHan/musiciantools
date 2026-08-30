import { createFileRoute } from '@tanstack/react-router'
import '@tanstack/react-start'
import { env } from 'cloudflare:workers'
import { handleProductEventRequest } from '../server/product-events'

export const Route = createFileRoute('/api/events')({
  server: {
    handlers: {
      POST: ({ request }) =>
        handleProductEventRequest(request, env.PRODUCT_ANALYTICS),
    },
  },
})
