import { registerAs } from '@nestjs/config'

export default registerAs('database.mongo', () => ({
  debug: process.env['DATABASE_MONGO_DEBUG'],
  autoIndex: process.env['DATABASE_MONGO_AUTO_INDEX'],
  uri: process.env['DATABASE_MONGO_URI'],
}))
