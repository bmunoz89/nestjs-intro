/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { set as mongooseSet } from 'mongoose'
import { AppModule } from 'src/app.module'
import { AppConfigService } from 'src/config/app/app.config.service'
import { MongoConfigService } from 'src/config/database/mongo/mongo.config.service'
import { SentryInterceptor } from 'src/sentry/sentry.interceptor'
declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appConfigService = app.get(AppConfigService)
  const mongoConfigService = app.get(MongoConfigService)

  if (mongoConfigService.debug) mongooseSet('debug', mongoConfigService.debug)
  // https://mongoosejs.com/docs/deprecations.html
  mongooseSet('useNewUrlParser', true)
  mongooseSet('useFindAndModify', false)
  mongooseSet('useCreateIndex', true)
  mongooseSet('useUnifiedTopology', true)

  app.useGlobalInterceptors(new SentryInterceptor())

  app.setGlobalPrefix(appConfigService.prefix)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )

  const port = appConfigService.port
  await app.listen(port)
  const logger = new Logger('Main')
  logger.log(`Server listening on port ${port}`)

  if (module.hot) {
    module.hot.accept()
    module.hot.dispose(() => app.close())
  }
}
// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
