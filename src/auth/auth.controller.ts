import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { AuthService } from 'src/auth/auth.service'
import { AuthLoginBodyDTO, AuthRegisterBodyDTO } from 'src/auth/dto/auth.dto'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

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
    const user: User | null = await this.usersService.login(
      authLoginBodyDTO.username,
    )
    if (user === null) throw new UnauthorizedException()

    const hasSamePassword: boolean = await user.comparePassword(
      authLoginBodyDTO.password,
    )
    if (!hasSamePassword) throw new UnauthorizedException()

    const accessToken: string = this.authService.signPayload({
      _id: user._id.toHexString(),
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
    const user: User = await this.usersService.register(authRegisterBodyDTO)
    const accessToken: string = this.authService.signPayload({
      _id: user._id.toHexString(),
      username: user.username,
    })
    return {
      user,
      accessToken,
    }
  }
}
