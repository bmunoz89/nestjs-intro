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
} from './dto/products.dto'
import { Product } from './schemas/product.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private productModel: Model<Product>,
  ) {}

  async create(productBodyDTO: ProductBodyDTO): Promise<Product> {
    const product = await this.productModel.create(productBodyDTO)
    return product
  }

  async getAll(): Promise<Product[]> {
    return await this.productModel.find().sort('-createdAt')
  }

  async getOne(id: ProductIdDTO['id']): Promise<Product | null> {
    return await this.productModel.findById(id)
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
