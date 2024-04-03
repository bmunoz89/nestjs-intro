/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  MORGAN_FORMAT_STRING,
  ResponseLoggingInterceptor,
  WinstonLoggerService,
  appendBodyToken,
  appendRequestIdToLogger,
  mongooseLogger,
  morganRequestLogger,
  morganResponseLogger,
} from '@libs/winston-logger'
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions } from '@nestjs/microservices'
import { NestExpressApplication } from '@nestjs/platform-express'
import { json } from 'body-parser'
import { set as mongooseSet } from 'mongoose'
import { AppModule } from 'src/app/app.module'
import { NodeEnv } from 'src/modules/env/env.schema'
import { EnvService } from 'src/modules/env/env.service'
import { format } from 'winston'
import transports, {
  ConsoleTransportInstance,
  FileTransportInstance,
} from 'winston/lib/winston/transports'

declare const module: any

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bodyParser: false,
  })
  app.use(json())
  const envService = app.get(EnvService)
  app.connectMicroservice<MicroserviceOptions>(envService.productMicroservice)

  const winstonTransports: Array<
    ConsoleTransportInstance | FileTransportInstance
  > = []

  if (envService.get('APP_LOGGER_COLOR')) {
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

    if (envService.get('NODE_ENV') !== NodeEnv.production)
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

  const globalLogger = new WinstonLoggerService({
    silent: envService.get('APP_LOGGER') === false,
    transports: winstonTransports,
  })

  if (envService.get('DATABASE_MONGO_DEBUG'))
    mongooseSet(
      'debug',
      mongooseLogger(globalLogger, {
        colors: envService.get('APP_LOGGER_COLOR'),
      }),
    )

  app.setGlobalPrefix(envService.get('APP_PREFIX'))

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
    colors: envService.get('APP_LOGGER_COLOR'),
  })

  app.use(
    morganRequestLogger(
      globalLogger,
      envService.get('APP_LOGGER_COLOR')
        ? MORGAN_FORMAT_STRING.REQUEST_COLORED
        : MORGAN_FORMAT_STRING.REQUEST,
    ),
  )
  app.use(
    morganResponseLogger(
      globalLogger,
      envService.get('APP_LOGGER_COLOR')
        ? MORGAN_FORMAT_STRING.RESPONSE_COLORED
        : MORGAN_FORMAT_STRING.RESPONSE,
    ),
  )

  app.useGlobalInterceptors(new ResponseLoggingInterceptor(globalLogger))

  app.disable('x-powered-by')

  await app.startAllMicroservices()
  const port = envService.get('APP_PORT')
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

void bootstrap()
