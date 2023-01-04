import { UserRole } from "../entity/User"

export interface JwtPayload {
  id: string
  fullname: string
  email: string
  role: UserRole
  createdAt: Date
}
