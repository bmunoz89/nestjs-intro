import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  NotFoundException,
  Param,
  Patch,
  Post,
  Put,
} from '@nestjs/common'
import {
  DeleteQueryResult,
  UpdateQueryResult,
} from 'src/interfaces/mongo.interface'
import {
  ProductBodyDTO,
  ProductIdDTO,
  ProductPartialBodyDTO,
} from 'src/products/dto/products.dto'
import { ProductsService } from 'src/products/products.service'
import { ProductI } from 'src/products/schemas/product.schema'

@Controller('products')
export class ProductsController {
  private readonly logger: Logger = new Logger(ProductsController.name)
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() productBodyDTO: ProductBodyDTO): Promise<ProductI> {
    this.logger.debug(productBodyDTO)
    const product: ProductI = await this.productsService.create(productBodyDTO)
    return product
  }

  @Get()
  async getAll(): Promise<ProductI[]> {
    return await this.productsService.getAll()
  }

  @Get(':id')
  async getOne(@Param() productIdDTO: ProductIdDTO): Promise<ProductI> {
    this.logger.debug(productIdDTO)
    const product: ProductI | null = await this.productsService.getOne(
      productIdDTO.id,
    )
    if (product === null) throw new NotFoundException()
    return product
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async update(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductBodyDTO,
  ): Promise<void> {
    this.logger.debug(productIdDTO)
    this.logger.debug(productBodyDTO)
    const result: UpdateQueryResult = await this.productsService.update(
      productIdDTO.id,
      productBodyDTO,
    )
    if (result.ok && result.nModified === 0) throw new NotFoundException()
  }

  @Patch(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async partialUpdate(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductPartialBodyDTO,
  ): Promise<void> {
    this.logger.debug(productIdDTO)
    this.logger.debug(productBodyDTO)
    if (Object.keys(productBodyDTO).length === 0)
      throw new BadRequestException()

    const result: UpdateQueryResult = await this.productsService.updatePartial(
      productIdDTO.id,
      productBodyDTO,
    )
    if (result.ok && result.nModified === 0) throw new NotFoundException()
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param() productIdDTO: ProductIdDTO): Promise<void> {
    this.logger.debug(productIdDTO)
    const result: DeleteQueryResult = await this.productsService.delete(
      productIdDTO.id,
    )
    if (result.ok && result.deletedCount === 0) throw new NotFoundException()
  }
}
