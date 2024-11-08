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

export const GetUserSchema = z.object({
  id: z.string(),
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
}).describe('Retorno de sucesso');

export const UsersResponseSchema = z.array(UserResponseSchema).describe('Retorno de sucesso com lista de usuários');