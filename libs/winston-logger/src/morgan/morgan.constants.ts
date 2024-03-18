import c from 'ansi-colors'

export const MORGAN_FORMAT_STRING = {
  REQUEST: `:method :url :body HTTP/:http-version :user-agent :remote-addr`,
  REQUEST_COLORED: c.white(
    [
      c.cyan.bold(':method'),
      c.yellow.bold.underline(':url'),
      ':body',
      c.gray('HTTP/:http-version :user-agent :remote-addr'),
    ].join(' '),
  ),
  RESPONSE: ':status - :res[content-length] bytes - :total-time[3] ms',
  RESPONSE_COLORED: [
    c.bold(':status'),
    c.gray(':res[content-length] bytes'),
    c.yellow(':total-time[3] ms'),
  ].join(c.gray(' - ')),
}
