import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import appConfig from './mongo.config'
import mongoConfigSchema from './mongo.config.schema'
import { MongoConfigService } from './mongo.config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: true,
      load: [appConfig],
      validationSchema: mongoConfigSchema,
      validationOptions: {
        stripUnknown: true,
        abortEarly: false,
      },
    } as ConfigModuleOptions),
  ],
  providers: [ConfigService, MongoConfigService],
  exports: [ConfigService, MongoConfigService],
})
export class MongoConfigModule {}
