import Joi from '@hapi/joi'

export default Joi.object({
  SENTRY_ENABLED: Joi.boolean().default(false),
  SENTRY_DEBUG: Joi.boolean().default(false),
  SENTRY_DSN: Joi.string().uri().required(),
  // SENTRY_LOG_LEVEL: Joi.string()
  //   .allow(...["debug", "info", "log", "warning", "error", "fatal"] satisfies SeverityLevel[])
  //   .default("error" satisfies SeverityLevel),
  SENTRY_SAMPLE_RATE: Joi.number().min(0).max(1).default(1),
  SENTRY_MAX_BREADCRUMBS: Joi.number().integer().min(1).max(100).default(100),
})
