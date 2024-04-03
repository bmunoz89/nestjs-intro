import { UserPrimitive } from 'src/modules/users/interfaces/user-primitive.interface'

export type UserNoPasswordPrimitive = Omit<UserPrimitive, 'password'>
