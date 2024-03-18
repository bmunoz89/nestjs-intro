import { MORGAN_FORMAT_STRING } from '@libs/winston-logger/morgan/morgan.constants'
import { WinstonLoggerService } from '@libs/winston-logger/winston-logger.service'
import { HttpStatus } from '@nestjs/common'
import morgan from 'morgan'

type MorganMiddleware = ReturnType<typeof morgan>

export const morganRequestLogger = (
  logger: WinstonLoggerService,
  morganFormatString: string = MORGAN_FORMAT_STRING.REQUEST,
): MorganMiddleware =>
  morgan(morganFormatString, {
    immediate: true,
    stream: {
      write: (message: string) => {
        logger.log(message, 'request')
      },
    },
  })

export const morganResponseLogger = (
  logger: WinstonLoggerService,
  morganFormatString: string = MORGAN_FORMAT_STRING.RESPONSE,
): MorganMiddleware[] => [
  morgan(morganFormatString, {
    stream: {
      write: (message: string) => logger.log(message, 'response'),
    },
    skip: (_req, res) => {
      const code = res.statusCode as HttpStatus
      return code >= HttpStatus.BAD_REQUEST
    },
  }),
  morgan(morganFormatString, {
    stream: {
      write: (message: string) => logger.warn(message, 'response'),
    },
    skip: (_req, res) => {
      const code = res.statusCode as HttpStatus
      return (
        code < HttpStatus.BAD_REQUEST ||
        code >= HttpStatus.INTERNAL_SERVER_ERROR
      )
    },
  }),
  morgan(morganFormatString, {
    stream: {
      write: (message: string) => logger.error(message, 'response'),
    },
    skip: (_req, res) => {
      const code = res.statusCode as HttpStatus
      return code < HttpStatus.INTERNAL_SERVER_ERROR
    },
  }),
]
