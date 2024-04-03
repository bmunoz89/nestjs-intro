import { zBoolean, zMicroserviceBrokers, zPort } from '@libs/zod'
import { z } from 'zod'

export enum NodeEnv {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

const appSchema = z.object({
  /** Default: api */
  APP_PREFIX: z.string().default('api'),
  /** Default: 3000 */
  APP_PORT: zPort.default(3000),
  /** Default: false */
  APP_LOGGER: zBoolean.default('false'),
  /** Default: false */
  APP_LOGGER_COLOR: zBoolean.default('false'),
})

const authSchema = z.object({
  /** Default: secret_key */
  AUTH_JWT_SECRET: z.string().default('secret_key'),
  /** Default: 12h */
  AUTH_JWT_SIGN_EXPIRES_IN: z.string().default('12h'),
})

const productMicroserviceSchema = z.object({
  PRODUCT_MICROSERVICE: zBoolean.default('false'),
  PRODUCT_MICROSERVICE_BROKERS: zMicroserviceBrokers,
})

const mongoSchema = z.object({
  /** Default: false */
  DATABASE_MONGO_DEBUG: zBoolean.default('false'),
  /** Default: false */
  DATABASE_MONGO_AUTO_INDEX: zBoolean.default('false'),
  DATABASE_MONGO_URI: z.string().regex(/^mongodb(\+srv)?:\/\/.*/),
})

const sentrySchema = z.object({
  /** Default: false */
  SENTRY_ENABLED: zBoolean.default('false'),
  /** Default: false */
  SENTRY_DEBUG: zBoolean.default('false'),
  SENTRY_DSN: z.string().url(),
  /** Default: 1 */
  SENTRY_SAMPLE_RATE: z.number().min(0).max(1).default(1),
  /** Default: 100 */
  SENTRY_MAX_BREADCRUMBS: z.number().min(1).max(100).default(100),
})

function ensureMicroservice<
  Schema,
  Fields extends keyof Schema,
  Microservice extends Fields extends `${string}_MICROSERVICE` ? Fields : never,
  Field extends Fields extends `${Microservice}_${string}` ? Fields : never,
>(ctx: z.RefinementCtx, schema: Schema, microservice: Microservice) {
  return function ensureField(field: Field) {
    if (schema[microservice] && schema[field] === undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: 'string',
        received: 'undefined',
        path: [field],
        message: `'${microservice}' is true, therefore the '${field}' value must be set`,
      })
    }

    if (!schema[microservice] && schema[field] !== undefined) {
      ctx.addIssue({
        code: z.ZodIssueCode.invalid_type,
        expected: 'undefined',
        received: 'string',
        path: [field],
        message: `'${microservice}' must be true to set the '${field}' value`,
      })
    }
  }
}

export const envSchema = z
  .object({
    /** Default: development */
    NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.development),
  })
  .merge(appSchema)
  .merge(authSchema)
  .merge(productMicroserviceSchema)
  .merge(mongoSchema)
  .merge(sentrySchema)
  .superRefine((schema, ctx) => {
    const ensureField = ensureMicroservice(ctx, schema, 'PRODUCT_MICROSERVICE')
    ensureField('PRODUCT_MICROSERVICE_BROKERS')
  })
  .readonly()

export type Env = z.infer<typeof envSchema>
