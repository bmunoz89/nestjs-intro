import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema, Types } from 'mongoose'

@DSchema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
})
export class Product extends Document {
  _id!: Types.ObjectId

  @Prop({
    required: true,
    trim: true,
  })
  title!: string

  @Prop({
    required: true,
    trim: true,
  })
  description!: string

  @Prop({
    required: true,
  })
  price!: number

  @Prop()
  readonly createdAt?: Date

  @Prop()
  readonly updatedAt?: Date
}

export const ProductSchema: Schema<Product> =
  SchemaFactory.createForClass(Product)
