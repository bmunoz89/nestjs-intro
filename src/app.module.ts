import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { AppConfigModule } from './config/app/app.config.module'
import { MongoConfigModule } from './config/database/mongo/mongo.config.module'
import { MongoConfigService } from './config/database/mongo/mongo.config.service'
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
export class AppModule {}
