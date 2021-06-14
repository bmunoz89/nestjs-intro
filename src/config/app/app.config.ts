import { registerAs } from '@nestjs/config'

export default registerAs('app', () => ({
  nodeEnv: process.env['NODE_ENV'],
  prefix: process.env['APP_PREFIX'],
  port: process.env['APP_PORT'],
  logger: process.env['APP_LOGGER'],
  loggerColor: process.env['APP_LOGGER_COLOR'],
}))
