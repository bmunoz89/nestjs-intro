import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { compare, hash } from 'bcrypt'
import { Document, HookNextFunction, Schema, Types } from 'mongoose'

const PASSWORD_SALT = 5

export interface UserI {
  _id: string
  username: string
  password: string
  readonly created_at?: Date
  readonly updated_at?: Date
}

@DSchema({
  versionKey: false,
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
  toJSON: {
    transform: (_doc: User, plainObj: UserI) => {
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
  readonly createdAt?: Date

  @Prop()
  readonly updatedAt?: Date

  public comparePassword!: (password: string) => Promise<boolean>
}

export const UserSchema: Schema<User> = SchemaFactory.createForClass(User)

UserSchema.index({ username: 1, password: 1 })

UserSchema.pre<User>('save', function(next: HookNextFunction) {
  if (!this.isModified('password')) return next()

  hash(this.password, PASSWORD_SALT, (error, passwordEncrypted) => {
    if (error) return next(error)

    this.password = passwordEncrypted
    next()
  })
})

UserSchema.methods.comparePassword = function(
  password: string,
): Promise<boolean> {
  return compare(password, this.password)
}
