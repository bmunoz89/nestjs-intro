import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { ProductsController } from 'src/products/products.controller'
import { ProductsService } from 'src/products/products.service'
import { Product, ProductSchema } from 'src/products/schemas/product.schema'

@Module({
  controllers: [ProductsController],
  providers: [ProductsService],
  imports: [
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
})
export class ProductsModule {}
