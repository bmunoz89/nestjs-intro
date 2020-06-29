import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import { AuthPayloadDTO } from './dto/auth.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  signPayload(authPayloadDTO: AuthPayloadDTO): string {
    return this.jwtService.sign(authPayloadDTO)
  }

  async validateUser(authPayloadDTO: AuthPayloadDTO): Promise<User | null> {
    return await this.usersService.findPayload(authPayloadDTO)
  }
}
