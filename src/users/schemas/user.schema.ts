import { Prop, Schema as DSchema, SchemaFactory } from '@nestjs/mongoose'
import { compare, hash } from 'bcrypt'
import { Document, HookNextFunction, Schema } from 'mongoose'

const PASSWORD_SALT = 5

@DSchema({
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
    trim: true,
  })
  password!: string

  @Prop()
  readonly createdAt?: Date

  @Prop()
  readonly updatedAt?: Date

  @Prop({ select: false })
  __v?: number

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

UserSchema.methods.comparePassword = async function(
  password: string,
): Promise<boolean> {
  return await compare(password, this.password)
}
