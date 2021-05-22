import { registerAs } from '@nestjs/config'

const auth = registerAs('auth', () => ({
  jwtSecret: process.env['AUTH_JWT_SECRET'],
  jwtSignExpiresIn: process.env['AUTH_JWT_SIGN_EXPIRES_IN'],
}))

export default auth
