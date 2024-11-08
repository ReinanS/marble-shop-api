import { z } from "zod"
import { LoginSchema } from "../schemas"

export type LoginInput = z.infer<typeof LoginSchema>

export type AcessAndRefreshToken = {
  accessToken: string,
  refreshToken: string,
}