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
import { Product, ProductI } from './schemas/product.schema'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name) private readonly productModel: Model<Product>,
  ) {}

  async create(productBodyDTO: ProductBodyDTO): Promise<ProductI> {
    const product = await this.productModel.create(productBodyDTO)
    return product.toJSON()
  }

  async getAll(): Promise<ProductI[]> {
    return await this.productModel
      .find()
      .sort('-createdAt')
      .lean()
  }

  async getOne(id: ProductIdDTO['id']): Promise<ProductI | null> {
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
