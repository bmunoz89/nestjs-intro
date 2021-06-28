import { UserNoPasswordLean } from 'src/users/interfaces/user-no-password-lean.interface'
import { UserNoPasswordPrimitive } from 'src/users/interfaces/user-no-password-primitive.interface'

export type SuccessAuthResponse = {
  user: UserNoPasswordLean | UserNoPasswordPrimitive
  accessToken: string
}
