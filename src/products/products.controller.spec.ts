import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductsController } from 'src/products/products.controller'
import { ProductsService } from 'src/products/products.service'
import { Product } from 'src/products/schemas/product.schema'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

describe('ProductsController', () => {
  let controller: ProductsController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        UsersService,
        {
          provide: getModelToken(Product.name),
          useValue: Product,
        },
        {
          provide: getModelToken(User.name),
          useValue: User,
        },
      ],
    }).compile()

    controller = module.get<ProductsController>(ProductsController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
