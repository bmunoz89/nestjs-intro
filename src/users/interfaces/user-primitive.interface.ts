import { UserLean } from 'src/users/interfaces/user-lean.interface'

export type UserPrimitive = Omit<
  UserLean,
  '_id' | 'createdAt' | 'updatedAt'
> & {
  _id: string
  createdAt: string
  updatedAt: string
}
