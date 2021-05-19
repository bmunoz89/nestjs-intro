import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema, Types } from 'mongoose'

export interface ProductI {
  _id: string
  title: string
  description: string
  price: number
  created_at: Date
  updated_at: Date
}

@DSchema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
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
