import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWTRequest } from 'src/auth/dto/auth.dto'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserNoPassword => {
    const request: JWTRequest = ctx.switchToHttp().getRequest<JWTRequest>()
    return request.user
  },
)
