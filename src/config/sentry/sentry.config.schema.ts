import Joi from '@hapi/joi'
import { LogLevel } from '@sentry/types'

const logLevels: number[] = Object.keys(LogLevel).reduce<number[]>(
  (result, key) => {
    const logLevel: unknown = LogLevel[key]
    if (typeof logLevel === 'number') result.push(logLevel)

    return result
  },
  [],
)

export default Joi.object({
  SENTRY_ENABLED: Joi.boolean().default(false),
  SENTRY_DEBUG: Joi.boolean().default(false),
  SENTRY_DSN: Joi.string().uri().required(),
  SENTRY_LOG_LEVEL: Joi.number()
    .integer()
    .allow(...logLevels),
})
