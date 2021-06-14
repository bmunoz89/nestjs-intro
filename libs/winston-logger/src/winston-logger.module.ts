import { DynamicModule, Module } from '@nestjs/common'
import { LoggerOptions } from 'winston'
import { NESTJS_WINSTON_CONFIG_OPTIONS } from './winston-logger.constants'
import { WinstonLoggerService } from './winston-logger.service'

@Module({})
export class WinstonLoggerModule {
  static forRoot(options: LoggerOptions): DynamicModule {
    return {
      module: WinstonLoggerModule,
      providers: [
        {
          provide: NESTJS_WINSTON_CONFIG_OPTIONS,
          useValue: options,
        },
        WinstonLoggerService,
      ],
      exports: [WinstonLoggerService],
    }
  }
}
