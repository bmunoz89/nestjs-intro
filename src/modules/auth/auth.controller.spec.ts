import { ConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { getModelToken } from '@nestjs/mongoose'
import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from 'src/modules/auth/auth.controller'
import { AuthService } from 'src/modules/auth/auth.service'
import { JWTStrategy } from 'src/modules/auth/jwt.strategy'
import { EnvModule } from 'src/modules/env/env.module'
import { envSchema } from 'src/modules/env/env.schema'
import { EnvService } from 'src/modules/env/env.service'
import { User } from 'src/modules/users/schemas/user.schema'
import { UsersService } from 'src/modules/users/users.service'

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
