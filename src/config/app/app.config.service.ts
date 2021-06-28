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

  /**
   * @default 'development'
   */
  get nodeEnv(): Environment {
    return this.getString('nodeEnv')
  }

  /**
   * @default 'api'
   */
  get prefix(): string {
    return this.getString('prefix')
  }

  /**
   * @default 3000
   */
  get port(): number {
    return this.getNumber('port')
  }

  /**
   * @default false
   */
  get logger(): boolean {
    return this.getBoolean('logger')
  }

  /**
   * @default false
   */
  get loggerColor(): boolean {
    return this.getBoolean('loggerColor')
  }
}
