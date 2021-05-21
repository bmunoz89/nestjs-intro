import { Injectable } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { AuthPayloadDTO } from 'src/auth/dto/auth.dto'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

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
