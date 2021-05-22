import { registerAs } from '@nestjs/config'

const app = registerAs('app', () => ({
  nodeEnv: process.env['NODE_ENV'],
  prefix: process.env['APP_PREFIX'],
  port: process.env['APP_PORT'],
  logger: process.env['APP_LOGGER'],
}))

export default app
