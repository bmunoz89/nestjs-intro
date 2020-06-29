import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

@Schema({
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    versionKey: false,
    transform: (_doc, plainObj) => {
      delete plainObj.password
      return plainObj
    },
  },
})
export class User extends Document {
  @Prop({
    lowercase: true,
    required: true,
    trim: true,
    unique: true,
  })
  username!: string

  @Prop({
    required: true,
    select: false,
    trim: true,
  })
  password!: string

  @Prop()
  readonly createdAt?: Date

  @Prop()
  readonly updatedAt?: Date

  @Prop({ select: false })
  __v?: number
}

export const UserSchema = SchemaFactory.createForClass(User)
