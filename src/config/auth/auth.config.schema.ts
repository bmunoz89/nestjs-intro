import * as Joi from '@hapi/joi'

export default Joi.object({
  AUTH_JWT_SECRET: Joi.string().default('secret_key'),
  AUTH_JWT_SIGN_EXPIRES_IN: Joi.string().default('12h'),
})
