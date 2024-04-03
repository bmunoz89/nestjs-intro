import { z } from 'zod'

export const zBoolean = z
  .enum(['true', 'false'])
  .transform((value): boolean => value === 'true')

export const zPort = z.number().min(0).max(65535)

export const zMicroserviceBrokers = z
  .string()
  .optional()
  .transform((value) => value?.split(','))
  .pipe(z.string().url().array().min(1).optional())
