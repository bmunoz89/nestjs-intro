import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import appConfig from 'src/config/database/mongo/mongo.config'
import mongoConfigSchema from 'src/config/database/mongo/mongo.config.schema'
import { MongoConfigService } from 'src/config/database/mongo/mongo.config.service'

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
  providers: [MongoConfigService],
  exports: [MongoConfigService],
})
export class MongoConfigModule {}
