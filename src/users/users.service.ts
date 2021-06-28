import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { AuthPayloadDTO, AuthRegisterBodyDTO } from 'src/auth/dto/auth.dto'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'
import { User } from 'src/users/schemas/user.schema'

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserNoPassword>,
  ) {}

  async login(username: string): Promise<UserNoPassword | null> {
    return await this.userModel.findOne({ username })
  }

  async register(
    authRegisterBodyDTO: AuthRegisterBodyDTO,
  ): Promise<UserNoPassword> {
    return await this.userModel.create(authRegisterBodyDTO)
  }

  async findPayload(
    authPayloadDTO: Pick<AuthPayloadDTO, 'username'>,
  ): Promise<UserNoPassword | null> {
    return await this.userModel.findOne({
      username: authPayloadDTO.username,
    })
  }
}
