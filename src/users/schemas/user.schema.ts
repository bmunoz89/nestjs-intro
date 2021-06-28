import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { compare, hash } from 'bcrypt'
import {
  Document,
  HookNextFunction,
  model,
  Model,
  Schema,
  Types,
} from 'mongoose'
import type { UserPrimitive } from 'src/users/interfaces/user-primitive.interface'
import type { SetOptional } from 'type-fest'

const PASSWORD_SALT = 5

@DSchema({
  versionKey: false,
  timestamps: { createdAt: true, updatedAt: true },
  toJSON: {
    transform: (
      _doc: User,
      plainObj: SetOptional<UserPrimitive, 'password'>,
    ) => {
      delete plainObj.password
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

  public comparePassword!: (password: string) => Promise<boolean>
}

export const UserSchema: Schema<User> = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1, password: 1 })

UserSchema.pre<User>(
  'save',
  async function (next: HookNextFunction): Promise<void> {
    if (!this.isModified('password')) {
      next()
      return
    }

    this.password = await hash(this.password, PASSWORD_SALT)
  },
)

UserSchema.methods.comparePassword = function (
  password: string,
): Promise<boolean> {
  return compare(password, this.password)
}

export const UserSchemaModel = model<User, Model<User>>(
  User.name,
  UserSchema,
  User.name,
)

export type UserModel = Model<User>
