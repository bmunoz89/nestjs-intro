import {
  IsInt,
  IsMongoId,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'
import { Types } from 'mongoose'

export class ProductIdDTO {
  @IsMongoId()
  readonly id: Types.ObjectId
}

export class ProductBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  readonly title: string

  @IsString()
  @MinLength(20)
  @MaxLength(300)
  readonly description: string

  @IsInt()
  @Min(0)
  @Max(10)
  readonly price: number
}

export class ProductPartialBodyDTO {
  @IsString()
  @MinLength(3)
  @MaxLength(100)
  @IsOptional()
  readonly title?: string

  @IsString()
  @MinLength(20)
  @MaxLength(300)
  @IsOptional()
  readonly description?: string

  @IsInt()
  @Min(0)
  @Max(10)
  @IsOptional()
  readonly price?: number
}
