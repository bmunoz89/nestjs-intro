import {
  ConflictException,
  Inject,
  Injectable,
  OnModuleInit,
} from '@nestjs/common'
import { ClientKafka } from '@nestjs/microservices'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { firstValueFrom } from 'rxjs'
import { AuthPayloadDTO, AuthRegisterBodyDTO } from 'src/auth/dto/auth.dto'
import { UserNoPassword } from 'src/users/interfaces/user-no-password.interface'
import { User } from 'src/users/schemas/user.schema'

@Injectable()
export class UsersService implements OnModuleInit {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserNoPassword>,
    @Inject('PRODUCT_MICROSERVICE') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    this.client.subscribeToResponseOf('product.sum')
    await this.client.connect()
  }

  private async usernameIsUsed(username: string): Promise<boolean> {
    const user = await this.userModel.exists({ username })
    return user !== null
  }

  async login(username: string): Promise<UserNoPassword | null> {
    const res = await firstValueFrom(
      this.client.send<number, number[]>('product.sum', [1, 2, 3]),
    )
    console.log('res :>> ', res)
    return await this.userModel.findOne({ username })
  }

  async register(
    authRegisterBodyDTO: AuthRegisterBodyDTO,
  ): Promise<UserNoPassword> {
    const usernameIsUsed = await this.usernameIsUsed(
      authRegisterBodyDTO.username,
    )

    if (usernameIsUsed) throw new ConflictException('Username already in use')

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
