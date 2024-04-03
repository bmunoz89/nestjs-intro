import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { UpdateWriteOpResult } from 'mongoose'
import { DeleteQueryResult } from 'src/interfaces/mongo.interface'
import { JWTAuthGuard } from 'src/modules/auth/jwt-auth.guard'
import {
  ProductBodyDTO,
  ProductIdDTO,
  ProductPartialBodyDTO,
} from 'src/modules/products/dto/products.dto'
import { ProductLean } from 'src/modules/products/interfaces/product-lean.interface'
import { ProductsService } from 'src/modules/products/products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() productBodyDTO: ProductBodyDTO): Promise<ProductLean> {
    const product: ProductLean =
      await this.productsService.create(productBodyDTO)
    return product
  }

  @UseGuards(JWTAuthGuard)
  @Get()
  async getAll(): Promise<ProductLean[]> {
    return await this.productsService.getAll()
  }

  @UseGuards(JWTAuthGuard)
  @Get(':id')
  async getOne(@Param() productIdDTO: ProductIdDTO): Promise<ProductLean> {
    const product: ProductLean | null = await this.productsService.getOne(
      productIdDTO.id,
    )
    if (product === null) throw new NotFoundException()
    return product
  }

  @UseGuards(JWTAuthGuard)
  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductBodyDTO,
  ): Promise<void> {
    const result: UpdateWriteOpResult = await this.productsService.update(
      productIdDTO.id,
      productBodyDTO,
    )
    if (result.acknowledged && result.modifiedCount === 0)
      throw new NotFoundException()
  }

  @UseGuards(JWTAuthGuard)
  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async partialUpdate(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductPartialBodyDTO,
  ): Promise<void> {
    if (Object.keys(productBodyDTO).length === 0)
      throw new BadRequestException()

    const result: UpdateWriteOpResult =
      await this.productsService.updatePartial(productIdDTO.id, productBodyDTO)
    if (result.acknowledged && result.modifiedCount === 0)
      throw new NotFoundException()
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() productIdDTO: ProductIdDTO): Promise<void> {
    const result: DeleteQueryResult = await this.productsService.delete(
      productIdDTO.id,
    )
    if (result.acknowledged && result.deletedCount === 0)
      throw new NotFoundException()
  }

  @MessagePattern('product.sum')
  mathSum(@Payload() data: number[]): number {
    console.log('data 1 :>> ', data)
    return (data || []).reduce((a, b) => a + b, 0)
  }
}
