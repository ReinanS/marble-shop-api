import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { handleError } from "../helpers/errors/error-handle.error";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ACESS_TOKEN_EXPIRATION_TIME, InvalidOrMissingRefreshTokenError, REFRESH_TOKEN_EXPIRATION_TIME } from "../helpers";
import { AccessTokenRenewedSchema, AuthorizationHeaderSchema, CreateUserSchema, CreateUserWhithoutRoleSchema, GetUserSchema, InternalServerErrorSchema, InvalidInputDataErrorSchema, InvalidOrMissingTokenErrorSchema, LoginReponseSchema, LoginSchema, LogoutResponseSchema, NoAuthorizationErrorSchema, UserAlreadyExistsErrorSchema, UserResponseSchema, UsersResponseSchema } from "../schemas";
import { CreateUserInput } from "../types/user";
import { LoginInput } from "../types/login";


export default async function AuthRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.post<{ Body: CreateUserInput }>('/register', {
    schema: {
      description: 'Create User',
      tags: ['Auth'],
      body: CreateUserWhithoutRoleSchema,
      response: {
        201: UserResponseSchema,
        400: InvalidInputDataErrorSchema,
        409: UserAlreadyExistsErrorSchema,
        500: InternalServerErrorSchema,
      }
    }
  }, async (req, reply) => {
   try {
      const data = await userUseCase.create(req.body);
      return reply.status(201).send(data);
    } catch (error) {
      console.error(error);
      handleError(error, reply);
    }
  });

  fastify.post<{ Body: LoginInput }>('/login', {
    schema: {
      description: 'Acess',
      tags: ['Auth'],
      body: LoginSchema,
      response: {
        200: LoginReponseSchema,
        401: NoAuthorizationErrorSchema,
        400: InvalidInputDataErrorSchema,
        500: InternalServerErrorSchema,
      }
    }
  }, async (req, reply) => {
    try {
      const {accessToken, refreshToken} = await userUseCase.login(req.body);
      reply.setCookie('refresh_token', refreshToken, {
        path: '/',
        httpOnly: true,
        secure: true,
        maxAge: 7 * 24 * 3600 // 7 days in seconds
      });

      return { accessToken }

    } catch (error) {
      console.error(error);
      handleError(error, reply);
    }
  });

  fastify.post('/refresh-token', {
    schema: {
      description: 'Rota para renovar o access token usando o refresh token via cookie',
      tags: ['Auth'],
      security: [{ cookieAuth: [] }],
      response: {
        200: AccessTokenRenewedSchema,
        401: InvalidOrMissingTokenErrorSchema,
        500: InternalServerErrorSchema,
      }
    },
  },async (req, reply) => {
    try {
      const refreshToken = req.cookies.refresh_token;
      if (!refreshToken) {
          throw new InvalidOrMissingRefreshTokenError();
      }

      const newAcessToken = await userUseCase.refreshToken(refreshToken, req.jwt)

      if (!newAcessToken) {
        throw new InvalidOrMissingRefreshTokenError();
      }

      return { accessToken: newAcessToken };
    } catch (error) {
      console.error(error);
      handleError(error, reply);
    }
  })

  fastify.delete('/logout', {
    preHandler: [authMiddleware], schema: {
      description: 'Rota para remover o refresh token dos cookies',
        tags: ['Auth'],
      response: {
        200: LogoutResponseSchema,
        500: InternalServerErrorSchema
      }
  } }, (_, reply) => {
    reply.clearCookie('refresh_token');
    return reply.send({ message: 'Logout successful' })
  });

  fastify.log.info('Auth routes registered');
}