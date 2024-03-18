import { coloringObject } from '@libs/winston-logger/winston-logger.utils'
import c from 'ansi-colors'
import { Request } from 'express'
import morgan from 'morgan'

export interface AppendBodyTokenOptions {
  /**
   * @default false
   */
  colors?: boolean
}

export const appendBodyToken = ({
  colors = false,
}: AppendBodyTokenOptions = {}) => {
  let parse: (body: any) => string

  if (colors) {
    parse = (body) => {
      const formattedBody = coloringObject(body)

      return c.white(formattedBody)
    }
  } else {
    parse = (body) => JSON.stringify(body)
  }

  return morgan.token('body', (req: Request) => {
    return parse(req.body ?? {})
  })
}
