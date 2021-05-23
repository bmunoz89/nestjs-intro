import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseConfigService } from 'src/config/config.service'

@Injectable()
export class MongoConfigService extends BaseConfigService {
  constructor(configService: ConfigService) {
    super('database.mongo', configService)
  }

  get debug(): boolean {
    return this.getBoolean('debug') as boolean
  }

  get autoIndex(): boolean {
    return this.getBoolean('autoIndex') as boolean
  }

  get uri(): string {
    return this.getString('uri') as string
  }
}
