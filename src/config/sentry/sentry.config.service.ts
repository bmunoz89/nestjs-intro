import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { LogLevel } from '@sentry/types'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class SentryConfigService extends BaseConfigService {
  constructor(configService: ConfigService) {
    super('sentry', configService)
  }

  get enabled(): boolean {
    return this.getBoolean('enabled') as boolean
  }

  get debug(): boolean {
    return this.getBoolean('debug') as boolean
  }

  get dsn(): string {
    return this.getString('dsn') as string
  }

  get logLevel(): LogLevel | undefined {
    return this.getNumber('logLevel')
  }

  get sampleRate(): number {
    return this.getNumber('sampleRate') as number
  }
}
