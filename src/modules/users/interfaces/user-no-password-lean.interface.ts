import { UserLean } from 'src/modules/users/interfaces/user-lean.interface'

export type UserNoPasswordLean = Omit<UserLean, 'password'>
