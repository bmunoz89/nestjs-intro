import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { ProductsService } from 'src/products/products.service'
import { Product } from 'src/products/schemas/product.schema'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

describe('ProductsService', () => {
  let service: ProductsService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
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

    service = module.get<ProductsService>(ProductsService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
