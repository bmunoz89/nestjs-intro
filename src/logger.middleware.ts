import { HttpStatus, Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('Request')

  private getMessage(
    req: Request,
    res: Response,
    requestStart: number,
  ): string {
    const userAgent = req.header('user-agent') ?? ''
    const ip = req.header('x-forwarded-for') ?? req.connection.remoteAddress
    const body = JSON.stringify(req.body)
    const protocol = `${req.protocol.toUpperCase()}/${req.httpVersion}`
    const elapsed = `${Date.now() - requestStart}ms`

    const message = [
      req.method,
      req.originalUrl,
      body,
      protocol,
      res.statusCode,
      req.header('content-length') ?? 0,
      elapsed,
      '-',
      userAgent,
      ip,
    ]

    return message.join(' ')
  }

  use(req: Request, res: Response, next: () => void): void {
    const requestStart = Date.now()

    res.on('finish', () => {
      const { statusCode } = res
      const message = this.getMessage(req, res, requestStart)

      if (statusCode < HttpStatus.BAD_REQUEST) return this.logger.log(message)
      else if (statusCode < HttpStatus.INTERNAL_SERVER_ERROR)
        return this.logger.warn(message)
      return this.logger.error(message)
    })

    next()
  }
}
