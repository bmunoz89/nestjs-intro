import { registerAs } from '@nestjs/config'

export default registerAs('database.mongo', () => ({
  debug: process.env['DATABASE_MONGO_DEBUG'],
  uri: process.env['DATABASE_MONGO_URI'],
}))
