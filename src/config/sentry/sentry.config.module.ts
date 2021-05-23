import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ConfigModuleOptions } from '@nestjs/config/dist/interfaces'
import appConfig from 'src/config/sentry/sentry.config'
import sentryConfigSchema from 'src/config/sentry/sentry.config.schema'
import { SentryConfigService } from 'src/config/sentry/sentry.config.service'

@Module({
  imports: [
    ConfigModule.forRoot({
      ignoreEnvFile: false,
      ignoreEnvVars: true,
      load: [appConfig],
      validationSchema: sentryConfigSchema,
      validationOptions: {
        stripUnknown: true,
        abortEarly: false,
      },
    } as ConfigModuleOptions),
  ],
  providers: [SentryConfigService],
  exports: [SentryConfigService],
})
export class SentryConfigModule {}
