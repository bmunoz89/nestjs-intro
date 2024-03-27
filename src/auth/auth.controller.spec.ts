import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { JWTStrategy } from 'src/auth/jwt.strategy'
import { envSchema } from 'src/env/env'
import { EnvModule } from 'src/env/env.module'
import { EnvService } from 'src/env/env.service'
import { User } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'

describe('Auth Controller', () => {
  let controller: AuthController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })
})
