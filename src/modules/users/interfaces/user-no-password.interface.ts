import { User } from 'src/modules/users/schemas/user.schema'

export type UserNoPassword = Omit<User, 'password'>
