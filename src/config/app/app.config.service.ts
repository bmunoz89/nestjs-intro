import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class AppConfigService extends BaseConfigService {
  constructor(configService: ConfigService) {
    super('app', configService)
  }

  get nodeEnv(): string {
    return this.getString('nodeEnv') as string
  }

  get prefix(): string {
    return this.getString('prefix') || ''
  }

  get port(): number {
    return this.getNumber('port') as number
  }

  get logger(): boolean {
    return this.getBoolean('logger') as boolean
  }
}
