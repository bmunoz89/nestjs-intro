import { Injectable, NotFoundException } from '@nestjs/common'
import { ProductModel } from 'src/products/products.model'
import {
  ProductBodyDTO,
  ProductIdDTO,
  ProductPartialBodyDTO,
} from './dto/products.dto'

@Injectable()
export class ProductsService {
  products: ProductModel[] = [
    {
      id: '2020-05-30T22:50:58.393Z',
      title: '2123',
      description: 'Description to be tested',
      price: 1,
    },
  ]

  insert(product: ProductBodyDTO): string {
    const id = new Date().toISOString()
    const newProduct: ProductModel = new ProductModel(
      id,
      product.title,
      product.description,
      product.price,
    )
    this.products.push(newProduct)
    return id
  }

  all(): ProductModel[] {
    return this.products.reverse()
  }

  get(id: ProductIdDTO['id']): ProductModel {
    const product: ProductModel | undefined = this.products.find(
      product => product.id === id,
    )
    if (product === undefined) throw new NotFoundException()
    return product
  }

  update(id: ProductIdDTO['id'], fieldsToUpdate: ProductBodyDTO): void {
    Object.assign(this.get(id), fieldsToUpdate)
  }

  updatePartial(
    id: ProductIdDTO['id'],
    fieldsToUpdate: ProductPartialBodyDTO,
  ): void {
    Object.assign(this.get(id), fieldsToUpdate)
  }
}
