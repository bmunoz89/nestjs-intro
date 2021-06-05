import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import authConfig from 'src/config/auth/auth.config'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class AuthConfigService extends BaseConfigService<typeof authConfig> {
  constructor(configService: ConfigService) {
    super('auth', configService)
  }

  get jwtSecret(): string {
    return this.getString('jwtSecret')
  }

  get jwtSignExpiresIn(): string {
    return this.getString('jwtSignExpiresIn')
  }
}
