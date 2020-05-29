import {
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator'

export class ProductIdDTO {
  @IsDateString()
  readonly id: string
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
