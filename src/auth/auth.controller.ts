import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import { AuthService } from './auth.service'
import { AuthLoginBodyDTO, AuthRegisterBodyDTO } from './dto/auth.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() authLoginBodyDTO: AuthLoginBodyDTO,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.usersService.login(authLoginBodyDTO)
    if (user === null) throw new UnauthorizedException()

    const accessToken = this.authService.signPayload({
      _id: user._id,
      username: user.username,
    })
    return {
      user,
      accessToken,
    }
  }

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(
    @Body() authRegisterBodyDTO: AuthRegisterBodyDTO,
  ): Promise<{ user: User; accessToken: string }> {
    const user = await this.usersService.register(authRegisterBodyDTO)
    const accessToken = this.authService.signPayload({
      _id: user._id,
      username: user.username,
    })
    return {
      user,
      accessToken,
    }
  }
}
