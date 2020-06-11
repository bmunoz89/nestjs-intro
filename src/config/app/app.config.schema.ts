import * as Joi from '@hapi/joi'

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid('test', 'development', 'staging', 'production')
    .default('development'),
  APP_PREFIX: Joi.string().default(''),
  APP_PORT: Joi.number()
    .integer()
    .min(0)
    .max(65536)
    .default(3000),
  APP_LOGGER: Joi.boolean().default(false),
})
