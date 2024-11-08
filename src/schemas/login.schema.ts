import { z } from "zod";

export const LoginSchema = z.object({
  email: z.string({
    required_error: 'Email is required',
    invalid_type_error: 'Email must be a string',
  }).email(),
  password: z.string().min(8)
})

export const LoginReponseSchema = z.object({
  accessToken: z.string().describe('JWT token para acesso ao sistema')
}).describe('Login realizado com sucesso, retornando o token de acesso JWT')

export const AccessTokenRenewedSchema = z.object({
  accessToken: z.string().describe('Novo access token gerado após renovação'),
}).describe('Resposta com novo access token');

export const AuthorizationHeaderSchema = z.object({
  authorization: z.string().min(1, 'Authorization header is required'),
});

export const LogoutResponseSchema = z.object({
  message: z.string()
}).describe('Mensagem de Sucesso')

