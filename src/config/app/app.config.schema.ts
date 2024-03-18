import Joi from '@hapi/joi'

export enum Environment {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

export default Joi.object({
  NODE_ENV: Joi.string()
    .valid(...Object.values(Environment))
    .default(Environment.development),
  APP_PREFIX: Joi.string().default('api'),
  APP_PORT: Joi.number().port().default(3000),
  APP_LOGGER: Joi.boolean().default(false),
  APP_LOGGER_COLOR: Joi.boolean().default(false),
})
