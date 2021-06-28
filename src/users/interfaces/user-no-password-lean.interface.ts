import { UserLean } from 'src/users/interfaces/user-lean.interface'

export type UserNoPasswordLean = Omit<UserLean, 'password'>
