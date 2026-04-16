import { loginService } from '@/services/authService'

export const loginController = async (
  email: string,
  password: string
) => {
  return await loginService(email, password)
}