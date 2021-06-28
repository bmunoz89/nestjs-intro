import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy, StrategyOptions } from 'passport-jwt'
import { AuthService } from 'src/auth/auth.service'
import { AuthJWTPayload } from 'src/auth/dto/auth.dto'
import { AuthConfigService } from 'src/config/auth/auth.config.service'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    readonly authConfigService: AuthConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfigService.jwtSecret,
    } as StrategyOptions)
  }

  async validate(payload: AuthJWTPayload): Promise<UserNoPassword> {
    const user = await this.authService.validateUser(payload)
    if (user === null) throw new UnauthorizedException()
    return user
  }
}
