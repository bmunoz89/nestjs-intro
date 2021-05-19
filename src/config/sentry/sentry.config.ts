import { registerAs } from '@nestjs/config'

export default registerAs('sentry', () => ({
  enabled: process.env.SENTRY_ENABLED,
  debug: process.env.SENTRY_DEBUG,
  dsn: process.env.SENTRY_DSN,
  logLevel: process.env.SENTRY_LOG_LEVEL,
  sampleRate: process.env.SENTRY_SAMPLE_RATE,
}))
