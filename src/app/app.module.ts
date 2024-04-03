import { WinstonLoggerModule } from '@libs/winston-logger'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ClientsModule } from '@nestjs/microservices'
import { MongooseModule } from '@nestjs/mongoose'
import { AuthModule } from 'src/auth/auth.module'
import { envSchema } from 'src/env/env'
import { EnvModule } from 'src/env/env.module'
import { EnvService } from 'src/env/env.service'
import { ProductsModule } from 'src/products/products.module'
import { SentryModule } from 'src/sentry/sentry.module'
import { UsersModule } from 'src/users/users.module'

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
