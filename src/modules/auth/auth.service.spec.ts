import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthService } from 'src/modules/auth/auth.service'
import { JWTStrategy } from 'src/modules/auth/jwt.strategy'
import { EnvModule } from 'src/modules/env/env.module'
import { envSchema } from 'src/modules/env/env.schema'
import { EnvService } from 'src/modules/env/env.service'
import { User } from 'src/modules/users/schemas/user.schema'
import { UsersService } from 'src/modules/users/users.service'

describe('AuthService', () => {
  let service: AuthService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        JWTStrategy,
        EnvService,
        AuthService,
        UsersService,
        {
          provide: getModelToken(User.name),
          useValue: User,
        },
      ],
      imports: [
        ConfigModule.forRoot({
          validate: (env) => envSchema.parse(env),
          isGlobal: true,
        }),
        JwtModule.registerAsync({
          imports: [EnvModule],
          useFactory: (envService: EnvService) => ({
            secret: envService.get('AUTH_JWT_SECRET'),
            signOptions: {
              expiresIn: envService.get('AUTH_JWT_SIGN_EXPIRES_IN'),
            },
          }),
          inject: [EnvService],
        }),
      ],
    }).compile()

    service = module.get<AuthService>(AuthService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
})
