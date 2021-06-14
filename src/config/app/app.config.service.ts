import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import appConfig from 'src/config/app/app.config'
import { Environment } from 'src/config/app/app.config.schema'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class AppConfigService extends BaseConfigService<typeof appConfig> {
  constructor(configService: ConfigService) {
    super('app', configService)
  }

  get nodeEnv(): Environment {
    return this.getString('nodeEnv')
  }

  get prefix(): string {
    return this.getString('prefix')
  }

  get port(): number {
    return this.getNumber('port')
  }

  get logger(): boolean {
    return this.getBoolean('logger')
  }

  get loggerColor(): boolean {
    return this.getBoolean('loggerColor')
  }
}
