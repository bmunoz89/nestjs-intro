import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseConfigService } from '../config.service'

@Injectable()
export class AuthConfigService extends BaseConfigService {
  constructor(configService: ConfigService) {
    super('auth', configService)
  }

  get jwtSecret(): string {
    return this.getString('jwtSecret') as string
  }

  get jwtSignExpiresIn(): string {
    return this.getString('jwtSignExpiresIn') as string
  }
}
