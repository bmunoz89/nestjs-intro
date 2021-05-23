import * as Joi from '@hapi/joi'

export default Joi.object({
  DATABASE_MONGO_DEBUG: Joi.boolean().default(false),
  DATABASE_MONGO_AUTO_INDEX: Joi.boolean().default(false),
  DATABASE_MONGO_URI: Joi.string()
    .required()
    .regex(new RegExp(/^mongodb(\+srv)?:\/\/.*/)),
})
