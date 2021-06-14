/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TOKEN_TYPE } from '@libs/winston-logger/morgan/morgan.constants'
import { coloringObject } from '@libs/winston-logger/winston-logger.utils'
import chalk from 'chalk'
import { Request, Response } from 'express'
import morgan from 'morgan'

export const appendMorganToken = (
  token: string,
  tokenType: TOKEN_TYPE,
  morganToken: string,
) =>
  morgan.token(morganToken, (req: Request, res: Response) => {
    if (tokenType === TOKEN_TYPE.Request) return req[token]
    else return res[token]
  })

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

      return chalk.white(formattedBody)
    }
  } else {
    parse = (body) => JSON.stringify(body)
  }

  return morgan.token('body', (req: Request) => {
    return parse(req.body ?? {})
  })
}
