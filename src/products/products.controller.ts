import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Logger,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common'
import {
  ProductBodyDTO,
  ProductIdDTO,
  ProductPartialBodyDTO,
} from 'src/products/dto/products.dto'
import { ProductModel } from 'src/products/products.model'
import { ProductsService } from 'src/products/products.service'

@Controller('products')
export class ProductsController {
  private readonly logger: Logger = new Logger(ProductsController.name)
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @HttpCode(HttpStatus.CREATED)
  create(@Body() productBodyDTO: ProductBodyDTO): ProductIdDTO {
    this.logger.debug(productBodyDTO)
    const id = this.productsService.insert(productBodyDTO)
    return {
      id,
    }
  }

  @Get()
  getAll(): ProductModel[] {
    return this.productsService.all()
  }

  @Get(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  retrieve(@Param() productIdDTO: ProductIdDTO): ProductModel {
    this.logger.debug(productIdDTO)
    return this.productsService.get(productIdDTO.id)
  }

  @Put(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  getOne(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductBodyDTO,
  ): void {
    this.logger.debug(productIdDTO)
    this.logger.debug(productBodyDTO)
    this.productsService.update(productIdDTO.id, productBodyDTO)
  }

  @Patch(':id')
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  )
  @HttpCode(HttpStatus.NO_CONTENT)
  partialUpdate(
    @Param() productIdDTO: ProductIdDTO,
    @Body() productBodyDTO: ProductPartialBodyDTO,
  ): void {
    this.logger.debug(productIdDTO)
    this.logger.debug(productBodyDTO)
    if (Object.keys(productBodyDTO).length === 0)
      throw new BadRequestException()
    this.productsService.updatePartial(productIdDTO.id, productBodyDTO)
  }
}
