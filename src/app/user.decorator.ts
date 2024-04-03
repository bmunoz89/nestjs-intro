import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { JWTRequest } from 'src/modules/auth/dto/auth.dto'
import { UserNoPassword } from 'src/modules/users/interfaces/user-no-password.interface'

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): UserNoPassword => {
    const request: JWTRequest = ctx.switchToHttp().getRequest<JWTRequest>()
    return request.user
  },
)
