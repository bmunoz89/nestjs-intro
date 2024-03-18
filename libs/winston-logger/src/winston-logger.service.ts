import { ConsoleLogger, Inject, Injectable, Scope } from '@nestjs/common'
import { LoggerOptions, Logger as WinstonLogger, createLogger } from 'winston'
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston-logger.constants'

@Injectable({ scope: Scope.TRANSIENT })
export class WinstonLoggerService extends ConsoleLogger {
  private logger: WinstonLogger

  constructor(@Inject(NESTJS_WINSTON_CONFIG_OPTIONS) config: LoggerOptions) {
    super()
    this.logger = createLogger(config)
  }

  setContext(serviceName: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      service: serviceName,
    }
  }

  appendDefaultMeta(key: string, value: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    this.logger.defaultMeta = {
      ...this.logger.defaultMeta,
      [key]: value,
    }
  }

  error(message: string | Error, stack?: string, context?: string): void {
    this.logger.error({ message, stack, service: context })
  }

  warn(message: string, context?: string): void {
    this.logger.warn(message, { service: context })
  }

  log(message: string, context?: string): void {
    this.logger.info(message, { service: context })
  }

  verbose(message: string, context?: string): void {
    this.logger.verbose(message, { service: context })
  }

  debug(message: string, context?: string): void {
    this.logger.debug(message, { service: context })
  }
}
