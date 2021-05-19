import { Injectable, Logger, NestMiddleware } from '@nestjs/common'
import { Request, Response } from 'express'

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private readonly logger: Logger = new Logger('Request')

  use(req: Request, res: Response, next: () => void): void {
    const requestStart = Date.now()

    res.on('finish', () => {
      const url = `${req.baseUrl}${req.url}`
      const body = JSON.stringify(req.body)
      const protocol = `${req.protocol.toUpperCase()}/${req.httpVersion}`
      const elapsed = `${Date.now() - requestStart}ms`
      const message = [
        req.method,
        url,
        body,
        protocol,
        res.statusCode,
        req.headers['content-length'] || 0,
        elapsed,
      ]
      this.logger.log(message.join(' '))
    })

    next()
  }
}
