import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import {
  AuthLoginBodyDTO,
  AuthPayloadDTO,
  AuthRegisterBodyDTO,
} from 'src/auth/dto/auth.dto'
import { User } from './schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async login(authLoginBodyDTO: AuthLoginBodyDTO): Promise<User | null> {
    return await this.userModel.findOne(authLoginBodyDTO)
  }

  async register(authRegisterBodyDTO: AuthRegisterBodyDTO): Promise<User> {
    return await this.userModel.create(authRegisterBodyDTO)
  }

  async findPayload(
    authPayloadDTO: Pick<AuthPayloadDTO, 'username'>,
  ): Promise<User | null> {
    return await this.userModel.findOne({
      username: authPayloadDTO.username,
    })
  }
}
