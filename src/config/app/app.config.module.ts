import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import appConfig from './app.config'
import appConfigSchema from './app.config.schema'
import { AppConfigService } from './app.config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: true,
      load: [appConfig],
      validationSchema: appConfigSchema,
      validationOptions: {
        stripUnknown: true,
        abortEarly: false,
      },
    } as ConfigModuleOptions),
  ],
  providers: [ConfigService, AppConfigService],
  exports: [ConfigService, AppConfigService],
})
export class AppConfigModule {}
