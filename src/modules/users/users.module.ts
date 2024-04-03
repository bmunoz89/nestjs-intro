import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from 'src/modules/users/schemas/user.schema'
import { UsersController } from 'src/modules/users/users.controller'
import { UsersService } from 'src/modules/users/users.service'

@Module({
  controllers: [UsersController],
  providers: [UsersService],
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  exports: [UsersService],
})
export class UsersModule {}
