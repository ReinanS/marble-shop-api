import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { handleError } from "../helpers/errors/error-handle.error";
import { authMiddleware } from "../middlewares/auth.middleware";
import { InvalidOrMissingRefreshTokenError } from "../helpers";
import { AccessTokenRenewedSchema, CreateUserWhithoutRoleSchema, EmailSendErrorSchema, UserIdSchema, InternalServerErrorSchema, InvalidInputDataErrorSchema, InvalidOrMissingTokenErrorSchema, LoginReponseSchema, LoginSchema, LogoutResponseSchema, NoAuthorizationErrorSchema, RecoveryPasswordResponseSchema, UserAlreadyExistsErrorSchema, UserEmailSchema, UserNotFoundErrorSchema, UserPasswordSchema, UserResponseSchema, ResetPasswordResponseSchema, ResetPasswordErrorSchema } from "../schemas";
import { CreateUserInput } from "../types/user";
import { LoginInput } from "../types/login";


export default async function AuthRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.post<{ Body: CreateUserInput }>('/register', {
    schema: {
      description: 'Registers a new user with the provided details.',
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
      description: 'Authenticates the user and returns an access token along with a refresh token stored in a cookie.',
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
      description: 'Renews the access token using the refresh token from the cookies.',
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

      return { accessToken: newAcessToken };
    } catch (error) {
      console.error(error);
      handleError(error, reply);
    }
  })

  fastify.delete('/logout', {
    preHandler: [authMiddleware], schema: {
    description: 'Logs out the user by removing the refresh token from the cookies.',
        tags: ['Auth'],
      response: {
        200: LogoutResponseSchema,
        500: InternalServerErrorSchema
      }
  } }, (_, reply) => {
    reply.clearCookie('refresh_token');
    return reply.send({ message: 'Logout successful' })
  });

  fastify.get<{ Params: { email: string } }>('/forgot-password/:email', {
    schema: {
      description: 'Requests a password recovery link for the user with the specified email address.',
      tags: ['Auth'],
      params: UserEmailSchema,
      response: {
        200: RecoveryPasswordResponseSchema,
        400: InvalidInputDataErrorSchema,
        404: UserNotFoundErrorSchema,
        500: InternalServerErrorSchema,
        503: EmailSendErrorSchema,
      }
    }
  },async (req, reply) => {
    try {
      const { email } = req.params;
      await userUseCase.forgotPassword(email)
      return { sucess: true }
    } catch (error) {
      handleError(error, reply);
    }
  })

  fastify.put<{ Params: { id: string }, Body: {password: string} }>('/reset-password/:id', {
    schema: {
      description: 'Resets the password for the user with the specified ID',
      tags: ['Auth'],
      security: [{ bearerAuth: [] }],
      params: UserIdSchema,
      body: UserPasswordSchema,
      response: {
        400: InvalidInputDataErrorSchema,
        404: UserNotFoundErrorSchema,
        200: ResetPasswordResponseSchema,
        500: InternalServerErrorSchema,
        503: ResetPasswordErrorSchema,
      }
    }
  }, async (req, reply) => {
    try {
      const { id } = req.params;
      const { password } = req.body;
      await userUseCase.resetPassword(id, password);
      return { sucess: true };
    } catch (error) {
      handleError(error, reply);
    }
  })


  fastify.log.info('Auth routes registered');
}