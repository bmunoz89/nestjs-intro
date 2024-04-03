import { Types } from 'mongoose'

export interface ProductLean {
  _id: Types.ObjectId
  title: string
  description: string
  price: number
  createdAt: Date
  updatedAt: Date
}
