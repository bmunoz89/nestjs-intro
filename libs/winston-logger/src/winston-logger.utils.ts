import chalk from 'chalk'
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
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
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
      chalk.white(
        chalk.blue('Mongoose: ') +
          chalk.white(collectionName + '.') +
          chalk.green(methodName) +
          chalk.cyan('(') +
          methodArgsPrettified +
          chalk.cyan(')'),
      ),
      'mongoose',
    )
  }
