import { IsString, MaxLength, MinLength } from 'class-validator'
import { Request } from 'express'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'
import { UserPrimitive } from 'src/users/interfaces/user-primitive.interface'

export class AuthRegisterBodyDTO {
  @IsString()
  @MinLength(2)
  @MaxLength(50)
  readonly username!: string

  @IsString()
  @MinLength(8)
  readonly password!: string
}

export class AuthLoginBodyDTO extends AuthRegisterBodyDTO {}

export type AuthPayloadDTO = Pick<UserPrimitive, '_id' | 'username'>

export interface AuthJWTPayload {
  _id: string
  username: string
  iat: number
  exp: number
}

export interface JWTRequest extends Request {
  user: UserNoPassword
}
