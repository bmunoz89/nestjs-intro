import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common'
import * as Sentry from '@sentry/node'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'

@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(_context: ExecutionContext, next: CallHandler): Observable<void> {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error)
        return throwError(error)
      }),
    )
  }
}
