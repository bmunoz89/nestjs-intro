import { IsAlphanumeric, IsString, MaxLength, MinLength } from 'class-validator'
import { Request } from 'express'
import { User, UserI } from 'src/users/schemas/user.schema'

export class AuthRegisterBodyDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly username!: string

  @IsAlphanumeric()
  @MinLength(8)
  readonly password!: string
}

export class AuthLoginBodyDTO extends AuthRegisterBodyDTO {}

export type AuthPayloadDTO = Pick<UserI, '_id' | 'username'>

export interface AuthJWTPayload {
  _id: string
  username: string
  iat: number
  exp: number
}

export interface JWTRequest extends Request {
  user: User
}
