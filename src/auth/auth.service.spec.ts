import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'src/auth/auth.service'
import { JWTStrategy } from 'src/auth/jwt.strategy'
import { AuthConfigModule } from 'src/config/auth/auth.config.module'
import { AuthConfigService } from 'src/config/auth/auth.config.service'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        UsersService,
        JWTStrategy,
        AuthConfigService,
        ConfigService,
        {
          provide: getModelToken(User.name),
          useValue: User,
        },
      ],
      imports: [
        JwtModule.registerAsync({
          imports: [AuthConfigModule],
          useFactory: (authConfigService: AuthConfigService) => ({
            secret: authConfigService.jwtSecret,
            signOptions: {
              expiresIn: authConfigService.jwtSignExpiresIn,
            },
          }),
          inject: [AuthConfigService],
        }),
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
