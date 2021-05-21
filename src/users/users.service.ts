import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuthPayloadDTO, AuthRegisterBodyDTO } from 'src/auth/dto/auth.dto'
import { User } from 'src/users/schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async login(username: string): Promise<User | null> {
    return await this.userModel.findOne({ username })
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
