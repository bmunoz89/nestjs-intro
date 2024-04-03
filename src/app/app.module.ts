import { WinstonLoggerModule } from '@libs/winston-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/modules/auth/auth.module'
import { EnvModule } from 'src/modules/env/env.module'
import { envSchema } from 'src/modules/env/env.schema'
import { EnvService } from 'src/modules/env/env.service'
import { ProductsModule } from 'src/modules/products/products.module'
import { SentryModule } from 'src/modules/sentry/sentry.module'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    MongooseModule.forRootAsync({
      useFactory: (envService: EnvService) => ({
        uri: envService.get('DATABASE_MONGO_URI'),
        autoIndex: envService.get('DATABASE_MONGO_AUTO_INDEX'),
      }),
      inject: [EnvService],
    }),
    ClientsModule.registerAsync({
      clients: [
        {
          name: 'PRODUCT_MICROSERVICE',
          useFactory: (envService: EnvService) =>
            envService.productMicroservice,
          inject: [EnvService],
        },
      ],
      isGlobal: true,
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
