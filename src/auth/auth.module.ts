import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { JWTStrategy } from 'src/auth/jwt.strategy'
import { EnvService } from 'src/env/env.service'
import { UsersModule } from 'src/users/users.module'

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
