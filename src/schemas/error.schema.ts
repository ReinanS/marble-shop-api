import { z } from "zod";

// Define o schema de erro interno do servidor com descrição
export const InternalServerErrorSchema = z.object({
  error: z.string().default('Internal Server Error').describe('Mensagem de erro genérica para falhas internas'),
}).describe('Erro inesperado no servidor');

// Define o schema para erro de email ou senha inválidos
export const InvalidEmailOrPasswordErrorSchema = z.object({
  error: z.string().default('Invalid email or password').describe('Erro quando email ou senha estão incorretos'),
}).describe('Erro de autenticação devido a credenciais inválidas');

// Define o schema para erro de ausência de cabeçalho de autorização
export const NoAuthorizationErrorSchema = z.object({
  error: z.string().default('No authorization header').describe('Erro para cabeçalho de autorização ausente'),
}).describe('Erro quando o cabeçalho de autorização não é fornecido');

// Define o schema para erro de usuário já existente
export const UserAlreadyExistsErrorSchema = z.object({
  error: z.string().default('User already exists').describe('Erro para tentativa de criação de usuário já existente'),
}).describe('Erro ao tentar registrar um usuário que já existe');

// Define o schema para erro de dados de entrada inválidos
export const InvalidInputDataErrorSchema = z.object({
  error: z.string().default('Invalid input data').describe('Erro para dados de entrada inválidos na requisição'),
}).describe('Erro de validação dos dados de entrada');

// Schema para Token inválido ou ausente
export const InvalidOrMissingTokenErrorSchema = z.object({
  error: z.string().default('Invalid or missing refresh token').describe('Erro quando o token de atualização é inválido ou está ausente'),
}).describe('Erro de autenticação devido a token inválido ou ausente');