import { Logger, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { set as mongooseSet } from 'mongoose'
import { AppModule } from './app.module'
import { AppConfigService } from './config/app/app.config.service'
import { MongoConfigService } from './config/database/mongo/mongo.config.service'
declare const module: any

async function bootstrap() {
  const app = await NestFactory.create(AppModule)
  const appConfigService = app.get(AppConfigService)
  const mongoConfigService = app.get(MongoConfigService)

  if (mongoConfigService.debug) mongooseSet('debug', mongoConfigService.debug)
  mongooseSet('useCreateIndex', true)

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
bootstrap()
