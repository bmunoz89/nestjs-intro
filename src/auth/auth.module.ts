import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { JWTStrategy } from 'src/auth/jwt.strategy'
import { AuthConfigModule } from 'src/config/auth/auth.config.module'
import { AuthConfigService } from 'src/config/auth/auth.config.service'
import { UsersModule } from 'src/users/users.module'

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
