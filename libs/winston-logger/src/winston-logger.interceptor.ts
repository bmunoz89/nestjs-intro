import { WinstonLoggerService } from '@libs/winston-logger/winston-logger.service'
import { coloringObject } from '@libs/winston-logger/winston-logger.utils'
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import c from 'ansi-colors'
import { Observable } from 'rxjs'
import { tap } from 'rxjs/operators'

@Injectable()
export class ResponseLoggingInterceptor implements NestInterceptor {
  constructor(private logger: WinstonLoggerService) {}

  intercept(_context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap({
        next: (value) => {
          this.logger.log(
            `${c.cyan('Response')}: ${c.white(coloringObject(value))}`,
            'response',
          )
        },
      }),
    )
  }
}
