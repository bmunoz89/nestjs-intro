import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductsModule } from './products/products.module'

@Module({
  imports: [
    ProductsModule,
    MongooseModule.forRoot(
      'mongodb://root:root@127.0.0.1:27017/nestjs_intro_api?authSource=admin',
    ),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
