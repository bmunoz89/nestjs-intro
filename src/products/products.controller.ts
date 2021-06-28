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
import { JWTAuthGuard } from 'src/auth/jwt-auth.guard'
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
import { ProductsService } from 'src/products/products.service'

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(JWTAuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() productBodyDTO: ProductBodyDTO): Promise<ProductLean> {
    const product: ProductLean = await this.productsService.create(
      productBodyDTO,
    )
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
    const result: UpdateQueryResult = await this.productsService.update(
      productIdDTO.id,
      productBodyDTO,
    )
    if (result.ok && result.nModified === 0) throw new NotFoundException()
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

    const result: UpdateQueryResult = await this.productsService.updatePartial(
      productIdDTO.id,
      productBodyDTO,
    )
    if (result.ok && result.nModified === 0) throw new NotFoundException()
  }

  @UseGuards(JWTAuthGuard)
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() productIdDTO: ProductIdDTO): Promise<void> {
    const result: DeleteQueryResult = await this.productsService.delete(
      productIdDTO.id,
    )
    if (result.ok && result.deletedCount === 0) throw new NotFoundException()
  }
}
