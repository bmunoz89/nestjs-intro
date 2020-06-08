import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema } from 'mongoose'

@DSchema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { versionKey: false },
})
export class Product extends Document {
  @Prop({
    required: true,
    trim: true,
  })
  title: string

  @Prop({
    required: true,
    trim: true,
  })
  description: string

  @Prop({
    required: true,
  })
  price: number

  @Prop()
  readonly createdAt?: Date

  @Prop()
  readonly updatedAt?: Date

  @Prop({ select: false })
  __v?: number
}

export const ProductSchema: Schema<Product> = SchemaFactory.createForClass(
  Product,
)
