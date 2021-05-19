import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import ms from 'ms'
import { AppConfigModule } from 'src/config/app/app.config.module'
import { AppConfigService } from 'src/config/app/app.config.service'
import { SentryConfigModule } from 'src/config/sentry/sentry.config.module'
import { SentryConfigService } from 'src/config/sentry/sentry.config.service'

@Module({
  imports: [AppConfigModule, SentryConfigModule],
})
export class SentryModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(SentryModule.name)

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly sentryConfigService: SentryConfigService,
  ) {}

  public onModuleInit(): void {
    Sentry.init({
      enabled: true,
      debug: this.sentryConfigService.debug,
      environment: this.appConfigService.nodeEnv,
      dsn: this.sentryConfigService.dsn,
      logLevel: this.sentryConfigService.logLevel,
      sampleRate: this.sentryConfigService.sampleRate,
      maxBreadcrumbs: 30,
      attachStacktrace: true,
      beforeSend: (event, hint) => {
        if (this.sentryConfigService.enabled || hint === undefined) return event

        if (hint.originalException instanceof Error)
          this.logger.error(
            hint.originalException.message,
            hint.originalException.stack,
          )
        else
          this.logger.error(
            hint.originalException || hint.syntheticException || event,
          )

        return null
      },
    })
  }

  public async onModuleDestroy(): Promise<void> {
    await Sentry.close(ms('2s'))
  }
}
