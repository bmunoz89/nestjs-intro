import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { BaseConfigService } from 'src/config/config.service'
import mongoConfig from 'src/config/database/mongo/mongo.config'

@Injectable()
export class MongoConfigService extends BaseConfigService<typeof mongoConfig> {
  constructor(configService: ConfigService) {
    super('database.mongo', configService)
  }

  get debug(): boolean {
    return this.getBoolean('debug')
  }

  get autoIndex(): boolean {
    return this.getBoolean('autoIndex')
  }

  get uri(): string {
    return this.getString('uri')
  }
}
