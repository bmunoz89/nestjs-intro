import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  DeleteQueryResult,
  UpdateQueryResult,
} from 'src/interfaces/mongo.interface'
import {
  ProductBodyDTO,
  ProductIdDTO,
  ProductPartialBodyDTO,
} from 'src/products/dto/products.dto'
import { ProductLean } from 'src/products/interfaces/product-lean.interface'
import { Product } from 'src/products/schemas/product.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(productBodyDTO: ProductBodyDTO): Promise<ProductLean> {
    const product = await this.productModel.create(productBodyDTO)
    return product.toJSON<ProductLean>()
  }

  async getAll(): Promise<ProductLean[]> {
    return await this.productModel.find().sort('-createdAt').lean()
  }

  async getOne(id: ProductIdDTO['id']): Promise<ProductLean | null> {
    return await this.productModel.findById(id).lean()
  }

  async update(
    id: ProductIdDTO['id'],
    fieldsToUpdate: ProductBodyDTO,
  ): Promise<UpdateQueryResult> {
    return await this.productModel.updateOne(
      {
        _id: id,
      },
      fieldsToUpdate,
    )
  }

  async updatePartial(
    id: ProductIdDTO['id'],
    fieldsToUpdate: ProductPartialBodyDTO,
  ): Promise<UpdateQueryResult> {
    return await this.productModel.updateOne(
      {
        _id: id,
      },
      fieldsToUpdate,
    )
  }

  async delete(id: ProductIdDTO['id']): Promise<DeleteQueryResult> {
    return await this.productModel.deleteOne({ _id: id })
  }
}
