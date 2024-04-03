import { UserLean } from 'src/modules/users/interfaces/user-lean.interface'

export type UserPrimitive = Omit<
  UserLean,
  '_id' | 'createdAt' | 'updatedAt'
> & {
  _id: string
  createdAt: string
  updatedAt: string
}
