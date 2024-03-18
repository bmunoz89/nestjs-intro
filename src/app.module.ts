import { WinstonLoggerModule } from '@libs/winston-logger/winston-logger.module'
import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { MongoConfigModule } from 'src/config/database/mongo/mongo.config.module'
import { MongoConfigService } from 'src/config/database/mongo/mongo.config.service'
import { ProductsModule } from 'src/products/products.module'
import { SentryModule } from 'src/sentry/sentry.module'
import { UsersModule } from 'src/users/users.module'

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [MongoConfigModule],
      useFactory: (mongoConfigService: MongoConfigService) => ({
        uri: mongoConfigService.uri,
        autoIndex: mongoConfigService.autoIndex,
      }),
      inject: [MongoConfigService],
    }),
    SentryModule,
    WinstonLoggerModule,
    AuthModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
