import { z } from "zod";
import { CreateUserSchema, UserResponseSchema, UserSchema } from "../schemas";

export type User = z.infer<typeof UserSchema>
export type CreateUserInput = z.infer<typeof CreateUserSchema>
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type ProfileResponse = Omit<User, 'password'>

