import chalk from 'chalk'

export enum TOKEN_TYPE {
  Request,
  Response,
}

export const MORGAN_FORMAT_STRING = {
  REQUEST: `:method :url :body HTTP/:http-version :user-agent :remote-addr`,
  REQUEST_COLORED: chalk.white(
    [
      chalk.cyan.bold(':method'),
      chalk.yellow.bold.underline(':url'),
      ':body',
      chalk.gray('HTTP/:http-version :user-agent :remote-addr'),
    ].join(' '),
  ),
  RESPONSE: ':status - :res[content-length] bytes - :total-time[3] ms',
  RESPONSE_COLORED: [
    chalk.bold(':status'),
    chalk.gray(':res[content-length] bytes'),
    chalk.yellow(':total-time[3] ms'),
  ].join(chalk.gray(' - ')),
}
