import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LogLevel } from '@sentry/types'
import { BaseConfigService } from 'src/config/config.service'
import sentryConfig from 'src/config/sentry/sentry.config'

@Injectable()
export class SentryConfigService extends BaseConfigService<
  typeof sentryConfig
> {
  constructor(configService: ConfigService) {
    super('sentry', configService)
  }

  /**
   * @default false
   */
  get enabled(): boolean {
    return this.getBoolean('enabled')
  }

  /**
   * @default false
   */
  get debug(): boolean {
    return this.getBoolean('debug')
  }

  get dsn(): string {
    return this.getString('dsn')
  }

  get logLevel(): LogLevel | undefined {
    return this.getNumberOrUndefined('logLevel')
  }

  /**
   * @default 30
   */
  get sampleRate(): number {
    return this.getNumber('sampleRate')
  }
}
