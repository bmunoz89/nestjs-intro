import { HttpStatus, ValidationPipe } from '@nestjs/common'
import { getModelToken } from '@nestjs/mongoose'
import { NestExpressApplication } from '@nestjs/platform-express'
import { Test, TestingModule } from '@nestjs/testing'
import { Types } from 'mongoose'
import { AuthController } from 'src/auth/auth.controller'
import { AuthService } from 'src/auth/auth.service'
import { SuccessAuthResponse } from 'src/auth/interfaces/auth-response.interface'
import { UserNoPasswordLean } from 'src/users/interfaces/user-no-password-lean.interface'
import { UserNoPasswordPrimitive } from 'src/users/interfaces/user-no-password-primitive.interface'
import { User, UserSchemaModel } from 'src/users/schemas/user.schema'
import { UsersService } from 'src/users/users.service'
import request, { Response } from 'supertest'

jest.mock('src/users/users.service')
const UsersServiceMock = UsersService as jest.MockedClass<typeof UsersService>

jest.mock('src/auth/auth.service')
const AuthServiceMock = AuthService as jest.MockedClass<typeof AuthService>

jest.mock('src/users/schemas/user.schema')
const UserModelMock = UserSchemaModel as jest.MockedClass<
  typeof UserSchemaModel
>

describe('AuthController (e2e)', () => {
  let app: NestExpressApplication

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [],
      controllers: [AuthController],
      providers: [
        UsersServiceMock,
        AuthServiceMock,
        {
          provide: getModelToken(User.name),
          useValue: UserModelMock,
        },
      ],
    }).compile()

    app = moduleFixture.createNestApplication<NestExpressApplication>()
    app.setGlobalPrefix('api')
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
      }),
    )
    await app.init()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  afterAll(async () => {
    await app.close()
  })

  describe('/api/auth/login (POST)', () => {
    it('OK - Logged in', async () => {
      const userNoPasswordLean: UserNoPasswordLean = {
        _id: new Types.ObjectId(),
        username: 'test',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      const userNoPasswordPrimitive: UserNoPasswordPrimitive = {
        _id: userNoPasswordLean._id.toHexString(),
        username: userNoPasswordLean.username,
        createdAt: userNoPasswordLean.createdAt.toISOString(),
        updatedAt: userNoPasswordLean.updatedAt.toISOString(),
      }
      const successAuthResponse: SuccessAuthResponse = {
        user: userNoPasswordPrimitive,
        accessToken: 'secure_access_token',
      }

      const userMock: User = new UserModelMock()
      userMock._id = userNoPasswordLean._id
      userMock.username = userNoPasswordLean.username
      userMock.password = 'ultra secret password'
      userMock.createdAt = userNoPasswordLean.createdAt
      userMock.updatedAt = userNoPasswordLean.updatedAt
      jest.spyOn(userMock, 'comparePassword').mockResolvedValue(true)
      jest.spyOn(userMock, 'toJSON').mockReturnValue(userNoPasswordPrimitive)

      UsersServiceMock.prototype.login.mockResolvedValueOnce(userMock)
      AuthServiceMock.prototype.signPayload.mockReturnValue(
        successAuthResponse.accessToken,
      )

      const response: Response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: userMock.username, password: userMock.password })
        .expect(HttpStatus.OK)

      expect(response.body).toStrictEqual(successAuthResponse)
    })

    it('UNAUTHORIZED - User not found', async () => {
      UsersServiceMock.prototype.login.mockResolvedValueOnce(null)

      const response: Response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'test', password: 'ultra secret password' })
        .expect(HttpStatus.UNAUTHORIZED)

      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      })
    })

    it('UNAUTHORIZED - Incorrect password', async () => {
      const userMock = new UserModelMock()

      jest.spyOn(userMock, 'comparePassword').mockResolvedValue(false)
      UsersServiceMock.prototype.login.mockResolvedValueOnce(userMock)

      const response: Response = await request(app.getHttpServer())
        .post('/api/auth/login')
        .send({ username: 'test', password: 'wrong password' })
        .expect(HttpStatus.UNAUTHORIZED)

      expect(response.body).toStrictEqual({
        message: 'Unauthorized',
        statusCode: HttpStatus.UNAUTHORIZED,
      })
    })
  })
})
