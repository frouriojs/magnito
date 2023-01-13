import { getPrismaClient } from '$/service/getPrismaClient'
import { defineController } from './$relay'

export default defineController(() => ({
  get: () => ({ status: 200, body: getPrismaClient() ? 'ok' : 'ng' }),
}))
