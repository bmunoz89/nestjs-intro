import { UserPrimitive } from 'src/users/interfaces/user-primitive.interface'

export type UserNoPasswordPrimitive = Omit<UserPrimitive, 'password'>
