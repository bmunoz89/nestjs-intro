import { Types } from 'mongoose'

export interface UserLean {
  _id: Types.ObjectId
  username: string
  password: string
  createdAt: Date
  updatedAt: Date
}
