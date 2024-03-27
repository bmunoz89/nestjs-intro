import { Logger, Module, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import * as Sentry from '@sentry/node'
import ms from 'ms'
import { EnvService } from 'src/env/env.service'

@Module({})
export class SentryModule implements OnModuleInit, OnModuleDestroy {
  private readonly logger: Logger = new Logger(SentryModule.name)

  constructor(private readonly envService: EnvService) {}

  public onModuleInit(): void {
    Sentry.init({
      enabled: true,
      debug: this.envService.get('SENTRY_DEBUG'),
      environment: this.envService.get('NODE_ENV'),
      dsn: this.envService.get('SENTRY_DSN'),
      sampleRate: this.envService.get('SENTRY_SAMPLE_RATE'),
      maxBreadcrumbs: this.envService.get('SENTRY_MAX_BREADCRUMBS'),
      attachStacktrace: true,
      beforeSend: (event, hint) => {
        if (this.envService.get('SENTRY_ENABLED') || hint === undefined)
          return event

        if (hint.originalException instanceof Error)
          this.logger.error(hint.originalException, 'sentry')
        else if (hint.originalException instanceof Promise)
          this.logger.error('Unhandled rejection', 'sentry')
        else
          this.logger.error(
            hint.originalException || hint.syntheticException || event,
            'sentry',
          )

        return null
      },
    })
  }

  public async onModuleDestroy(): Promise<void> {
    await Sentry.close(ms('2s'))
  }
}
