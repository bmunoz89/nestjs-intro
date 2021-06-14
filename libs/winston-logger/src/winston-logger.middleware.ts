import { WinstonLoggerService } from '@libs/winston-logger/winston-logger.service'
import { NextFunction, Request, Response } from 'express'
import { v4 as uuidv4 } from 'uuid'

export interface RequestIdOptions {
  /**
   * @default 'X-Request-Id'
   */
  headerName?: string
  /**
   * @default 'request-id'
   */
  winstonMetaName?: string
  /**
   * Add request id to response header
   * If set to true, the middleware/plugin will add request id to the specified
   *  header. Use headerName option to specify header name.
   * @default false
   */
  echoHeader?: boolean
  /**
   * Respect request header flag
   * If set to true, the middleware/plugin will always use a value from
   *  the specified header (if the value is present).
   * @default false
   */
  useHeader?: boolean
  requestIdFactory?: (req: Request) => string
}

/**
 * A custom function to generate your request ids
 * By default generates a UUID v4
 */
export const appendRequestIdToLogger =
  (
    logger: WinstonLoggerService,
    {
      headerName = 'X-Request-Id',
      winstonMetaName = 'request-id',
      echoHeader = false,
      useHeader = false,
      requestIdFactory,
    }: RequestIdOptions = {},
  ) =>
  (req: Request, res: Response, next: NextFunction): void => {
    let header: string | undefined = useHeader
      ? req.header(headerName)
      : undefined

    if (header === undefined) {
      const requestId: string = requestIdFactory
        ? requestIdFactory(req)
        : uuidv4()

      header = requestId
    }

    if (echoHeader) res.setHeader(headerName, header)

    logger.appendDefaultMeta(winstonMetaName, header)
    next()
  }
