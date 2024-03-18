import c from 'ansi-colors'
import * as util from 'util'
import { WinstonLoggerService } from './winston-logger.service'

export interface MongooseLoggerOptions {
  /**
   * @default false
   */
  colors?: boolean
}

export type ColoringObjectOptions = util.InspectOptions

export const coloringObject = (
  object: any,
  options: ColoringObjectOptions = {},
): string => {
  return util.inspect(object, {
    ...options,
    colors: options.colors ?? true,
    depth: options.depth ?? 10,
    showHidden: options.showHidden ?? false,
    breakLength: options.breakLength ?? Infinity,
  })
}

export const mongooseLogger =
  (
    logger: WinstonLoggerService,
    { colors = false }: MongooseLoggerOptions = {},
  ) =>
  (collectionName: string, methodName: string, ...methodArgs: any[]): void => {
    const methodArgsPrettified = methodArgs
      .map((methodArg) =>
        colors ? coloringObject(methodArg) : JSON.stringify(methodArg),
      )
      .join(', ')

    if (colors === false) {
      logger.debug(
        `Mongoose: ${collectionName}.${methodName}(${methodArgsPrettified})`,
        'mongoose',
      )

      return
    }

    logger.debug(
      c.white(
        c.blue('Mongoose: ') +
          c.white(collectionName + '.') +
          c.green(methodName) +
          c.cyan('(') +
          methodArgsPrettified +
          c.cyan(')'),
      ),
      'mongoose',
    )
  }
