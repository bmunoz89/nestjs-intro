import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: { versionKey: false },
})
export class Product extends Document {
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

  @Prop({ select: false })
  __v?: number
}

export const ProductSchema = SchemaFactory.createForClass(Product)
