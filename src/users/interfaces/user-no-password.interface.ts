import { User } from 'src/users/schemas/user.schema'

export type UserNoPassword = Omit<User, 'password'>
