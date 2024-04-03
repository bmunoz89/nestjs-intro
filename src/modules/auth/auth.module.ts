import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from 'src/modules/auth/auth.controller'
import { AuthService } from 'src/modules/auth/auth.service'
import { JWTStrategy } from 'src/modules/auth/jwt.strategy'
import { EnvService } from 'src/modules/env/env.service'
import { UsersModule } from 'src/modules/users/users.module'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      useFactory: (envService: EnvService) => ({
        secret: envService.get('AUTH_JWT_SECRET'),
        signOptions: {
          expiresIn: envService.get('AUTH_JWT_SIGN_EXPIRES_IN'),
        },
      }),
      inject: [EnvService],
    }),
  ],
})
export class AuthModule {}
