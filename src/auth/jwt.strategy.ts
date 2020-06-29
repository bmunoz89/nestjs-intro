import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import {
  ExtractJwt,
  Strategy,
  StrategyOptions,
  VerifiedCallback,
} from 'passport-jwt'
import { AuthConfigService } from 'src/config/auth/auth.config.service'
import { AuthService } from './auth.service'
import { AuthJWTPayload } from './dto/auth.dto'

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly authService: AuthService,
    authConfigService: AuthConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: authConfigService.jwtSecret,
    } as StrategyOptions)
  }

  async validate(payload: AuthJWTPayload, done: VerifiedCallback) {
    const user = await this.authService.validateUser(payload)
    if (user === null) return done(new UnauthorizedException())
    return done(null, user, payload.iat)
  }
}
