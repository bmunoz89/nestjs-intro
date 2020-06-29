import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWTRequest } from './auth/dto/auth.dto'
import { User } from './users/schemas/user.schema'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): User => {
    const request: JWTRequest = ctx.switchToHttp().getRequest<JWTRequest>()
    return request.user
  },
)
