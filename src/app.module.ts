import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppConfigModule } from './config/app/app.config.module'
import { AppConfigService } from './config/app/app.config.service'
import { MongoConfigModule } from './config/database/mongo/mongo.config.module'
import { MongoConfigService } from './config/database/mongo/mongo.config.service'
import { LoggerMiddleware } from './logger.middleware'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [
    AppConfigModule,
    MongoConfigModule,
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: (mongoConfigService: MongoConfigService) => ({
        uri: mongoConfigService.uri,
      }),
      inject: [MongoConfigService],
    }),
    ProductsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly appConfigService: AppConfigService) {}

  configure(consumer: MiddlewareConsumer) {
    if (this.appConfigService.logger)
      consumer.apply(LoggerMiddleware).forRoutes('/')
  }
}
