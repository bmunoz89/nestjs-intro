import { Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import authConfig from './auth.config'
import authConfigSchema from './auth.config.schema'
import { AuthConfigService } from './auth.config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: true,
      load: [authConfig],
      validationSchema: authConfigSchema,
      validationOptions: {
        stripUnknown: true,
        abortEarly: false,
      },
    } as ConfigModuleOptions),
  ],
  providers: [ConfigService, AuthConfigService],
  exports: [ConfigService, AuthConfigService],
})
export class AuthConfigModule {}
