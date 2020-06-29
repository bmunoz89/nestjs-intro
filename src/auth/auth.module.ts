import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthConfigModule } from 'src/config/auth/auth.config.module'
import { AuthConfigService } from 'src/config/auth/auth.config.service'
import { UsersModule } from 'src/users/users.module'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { JWTStrategy } from './jwt.strategy'

@Module({
  controllers: [AuthController],
  providers: [AuthService, JWTStrategy],
  imports: [
    UsersModule,
    AuthConfigModule,
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
})
export class AuthModule {}
