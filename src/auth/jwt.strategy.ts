import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { AuthService } from 'src/auth/auth.service'
import { AuthJWTPayload } from 'src/auth/dto/auth.dto'
import { EnvService } from 'src/env/env.service'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly envService: EnvService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: envService.get('AUTH_JWT_SECRET'),
    } as StrategyOptions)
  }

  async validate(payload: AuthJWTPayload): Promise<UserNoPassword> {
    const user = await this.authService.validateUser(payload)
    if (user === null) throw new UnauthorizedException()
    return user
  }
}
