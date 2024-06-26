import { UserNoPasswordLean } from 'src/modules/users/interfaces/user-no-password-lean.interface'
import { UserNoPasswordPrimitive } from 'src/modules/users/interfaces/user-no-password-primitive.interface'

export type SuccessAuthResponse = {
  user: UserNoPasswordLean | UserNoPasswordPrimitive
  accessToken: string
}
