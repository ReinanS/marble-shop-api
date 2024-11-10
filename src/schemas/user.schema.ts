import { z } from 'zod'
import { EmployerValidator } from './employer.schema'

export const RoleSchema = z.enum(['USER', 'ADMIN'])

export const UserSchema = z.object({
  id: z.string(),
  name: z.string().max(100),
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).max(100).email(),
  password: z.string().min(8),
  role: RoleSchema,
  employer_id: z.string().nullable(),
  created_at: z.date(),
  updated_at: z.date().nullable(),
})

export const UserIdSchema = z.object({
  id: z.string(),
})

export const UserEmailSchema = z.object({
  email: z.string().email(),
})

export const UserPasswordSchema = z.object({
  password: z.string().min(8),
})

export const CreateUserSchema = UserSchema.pick({
  name: true,
  email: true,
  password: true,
  role: true,
}).extend({
  employer: EmployerValidator
})

export const CreateUserWhithoutRoleSchema = CreateUserSchema.omit({
  role: true
})

export const UserResponseSchema = UserSchema.pick({
  name: true,
  email: true,
  role: true,
}).describe('Successful response')

export const UsersResponseSchema = z.array(UserResponseSchema).describe('Successful response with a list of users')

export const RecoveryPasswordResponseSchema = z.object({
  success: z.boolean()
}).describe('Password recovery request successfully processed')

export const ResetPasswordResponseSchema = z.object({
  success: z.boolean()
}).describe('Password reset request successfully processed')
