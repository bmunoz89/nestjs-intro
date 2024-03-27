import { z } from 'zod'

export enum NodeEnv {
  test = 'test',
  development = 'development',
  staging = 'staging',
  production = 'production',
}

const zBoolean = z
  .enum(['true', 'false'])
  .transform((value): boolean => value === 'true')

const appSchema = z.object({
  /** Default: api */
  APP_PREFIX: z.string().default('api'),
  /** Default: 3000 */
  APP_PORT: z.number().min(0).max(65535).default(3000),
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

export const envSchema = z
  .object({
    /** Default: development */
    NODE_ENV: z.nativeEnum(NodeEnv).default(NodeEnv.development),
  })
  .merge(appSchema)
  .merge(authSchema)
  .merge(mongoSchema)
  .merge(sentrySchema)
  .readonly()

export type Env = z.infer<typeof envSchema>
