import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import authConfig from 'src/config/auth/auth.config'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class AuthConfigService extends BaseConfigService<typeof authConfig> {
  constructor(configService: ConfigService) {
    super('auth', configService)
  }

  /**
   * @default 'secret_key'
   */
  get jwtSecret(): string {
    return this.getString('jwtSecret')
  }

  /**
   * @default '12h'
   */
  get jwtSignExpiresIn(): string {
    return this.getString('jwtSignExpiresIn')
  }
}
