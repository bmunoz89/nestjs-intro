/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { appendBodyToken } from '@libs/winston-logger/morgan/morgan.config'
import { MORGAN_FORMAT_STRING } from '@libs/winston-logger/morgan/morgan.constants'
import {
  morganRequestLogger,
  morganResponseLogger,
} from '@libs/winston-logger/morgan/morgan.middleware'
import { ResponseLoggingInterceptor } from '@libs/winston-logger/winston-logger.interceptor'
import { appendRequestIdToLogger } from '@libs/winston-logger/winston-logger.middleware'
import { WinstonLoggerService } from '@libs/winston-logger/winston-logger.service'
import { mongooseLogger } from '@libs/winston-logger/winston-logger.utils'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { NestExpressApplication } from '@nestjs/platform-express'
import { json } from 'body-parser'
import { set as mongooseSet } from 'mongoose'
import { AppModule } from 'src/app.module'
import { Environment } from 'src/config/app/app.config.schema'
import { AppConfigService } from 'src/config/app/app.config.service'
import { MongoConfigService } from 'src/config/database/mongo/mongo.config.service'
import { format } from 'winston'
import transports, {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports'

declare const module: any

const isVite = process.env['VITE_USER_NODE_ENV'] === 'development'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  })
  app.use(json())
  const appConfigService = app.get(AppConfigService)
  const mongoConfigService = app.get(MongoConfigService)

  const winstonTransports: Array<
    ConsoleTransportInstance | FileTransportInstance
  > = []

  if (appConfigService.logger) {
    if (appConfigService.loggerColor) {
      winstonTransports.push(
        new transports.File({
          format: format.combine(format.uncolorize(), format.json()),
          filename: 'logs/combined.log',
        }),
      )

      winstonTransports.push(
        new transports.Console({
          format: format.combine(
            format.errors({ stack: true }),
            format.colorize({ all: true }),
            format.timestamp({ format: 'isoDateTime' }),
            format.simple(),
          ),
          level: 'debug',
        }),
      )
    } else {
      winstonTransports.push(
        new transports.File({
          format: format.json(),
          filename: 'logs/combined.log',
        }),
      )

      if (appConfigService.nodeEnv !== Environment.production)
        winstonTransports.push(
          new transports.Console({
            format: format.combine(
              format.errors({ stack: true }),
              format.timestamp({ format: 'isoDateTime' }),
              format.simple(),
            ),
            level: 'info',
          }),
        )
    }
  }

  const globalLogger = new WinstonLoggerService({
    transports: winstonTransports,
  })

  if (mongoConfigService.debug)
    mongooseSet(
      'debug',
      mongooseLogger(globalLogger, {
        colors: appConfigService.loggerColor,
      }),
    )
  // https://mongoosejs.com/docs/deprecations.html
  mongooseSet('useNewUrlParser', true)
  mongooseSet('useFindAndModify', false)
  mongooseSet('useCreateIndex', true)
  mongooseSet('useUnifiedTopology', true)

  app.setGlobalPrefix(appConfigService.prefix)

  if (isVite === false)
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )

  app.use(
    appendRequestIdToLogger(globalLogger, {
      headerName: 'X-Request-Id',
      winstonMetaName: 'request-id',
      echoHeader: false,
      useHeader: true,
    }),
  )

  app.use(
    appendRequestIdToLogger(globalLogger, {
      headerName: 'X-Track-Id',
      winstonMetaName: 'track-id',
      echoHeader: true,
      useHeader: true,
    }),
  )

  appendBodyToken({
    colors: appConfigService.loggerColor,
  })

  app.use(
    morganRequestLogger(
      globalLogger,
      appConfigService.loggerColor
        ? MORGAN_FORMAT_STRING.REQUEST_COLORED
        : MORGAN_FORMAT_STRING.REQUEST,
    ),
  )
  app.use(
    morganResponseLogger(
      globalLogger,
      appConfigService.loggerColor
        ? MORGAN_FORMAT_STRING.RESPONSE_COLORED
        : MORGAN_FORMAT_STRING.RESPONSE,
    ),
  )

  app.useGlobalInterceptors(new ResponseLoggingInterceptor(globalLogger))

  app.disable('x-powered-by')

  if (isVite) return app

  const port = appConfigService.port
  await app.listen(port)
  const logger = new Logger('Main')
  logger.log(`Server listening on port ${port}`)

  app.useLogger(globalLogger)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }

  return app
}

export const createViteNodeApp = bootstrap()
