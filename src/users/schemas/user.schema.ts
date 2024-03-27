import { Schema as DSchema, Prop, SchemaFactory } from '@nestjs/mongoose'
import { compare, hash } from 'bcrypt'
import {
  CallbackWithoutResultAndOptionalError,
  Document,
  Model,
  Schema,
  Types,
  model,
} from 'mongoose'

const PASSWORD_SALT = 5

@DSchema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    transform(_doc, plainObj) {
      if ('password' in plainObj) {
        delete plainObj.password
      }
      return plainObj
    },
  },
  toObject: {
    transform(_doc, plainObj) {
      if ('password' in plainObj) {
        delete plainObj.password
      }
      return plainObj
    },
  },
})
export class User extends Document {
  _id!: Types.ObjectId

  @Prop({
    lowercase: true,
    required: true,
    trim: true,
    unique: true,
  })
  username!: string

  @Prop({
    required: true,
    trim: true,
  })
  password!: string

  @Prop()
  createdAt!: Date

  @Prop()
  updatedAt!: Date

  public comparePassword(password: string): Promise<boolean> {
    return compare(password, this.password)
  }
}

export const UserSchema: Schema<User> = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1, password: 1 })

UserSchema.pre(
  'save',
  async function (next: CallbackWithoutResultAndOptionalError): Promise<void> {
    if (!this.isModified('password')) {
      next()
      return
    }

    this.password = await hash(this.password, PASSWORD_SALT)
  },
)

// https://mongoosejs.com/docs/advanced_schemas.html
UserSchema.loadClass(User)

export const UserSchemaModel = model<User, Model<User>>(
  User.name,
  UserSchema,
  User.name,
)

export type UserModel = Model<User>
