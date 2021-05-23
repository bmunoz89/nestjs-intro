import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { AppConfigModule } from 'src/config/app/app.config.module'
import { AppConfigService } from 'src/config/app/app.config.service'
import { MongoConfigModule } from 'src/config/database/mongo/mongo.config.module'
import { MongoConfigService } from 'src/config/database/mongo/mongo.config.service'
import { LoggerMiddleware } from 'src/logger.middleware'
import { ProductsModule } from 'src/products/products.module'
import { SentryModule } from 'src/sentry/sentry.module'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    AppConfigModule,
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: (mongoConfigService: MongoConfigService) => ({
        uri: mongoConfigService.uri,
        autoIndex: mongoConfigService.autoIndex,
      }),
      inject: [MongoConfigService],
    }),
    ProductsModule,
    UsersModule,
    AuthModule,
    SentryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule implements NestModule {
  constructor(private readonly appConfigService: AppConfigService) {}

  configure(consumer: MiddlewareConsumer): void {
    if (this.appConfigService.logger)
      consumer.apply(LoggerMiddleware).forRoutes('/')
  }
}
