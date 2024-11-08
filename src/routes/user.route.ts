import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { handleError } from "../helpers/errors/error-handle.error";
import { authMiddleware } from "../middlewares/auth.middleware";
import { ACESS_TOKEN_EXPIRATION_TIME, InvalidOrMissingRefreshTokenError, REFRESH_TOKEN_EXPIRATION_TIME } from "../helpers";
import { AccessTokenRenewedSchema, AuthorizationHeaderSchema, CreateUserSchema, CreateUserWhithoutRoleSchema, GetUserSchema, InternalServerErrorSchema, InvalidInputDataErrorSchema, InvalidOrMissingTokenErrorSchema, LoginReponseSchema, LoginSchema, LogoutResponseSchema, NoAuthorizationErrorSchema, UserAlreadyExistsErrorSchema, UserResponseSchema, UsersResponseSchema } from "../schemas";
import { CreateUserInput } from "../types/user";
import { LoginInput } from "../types/login";


export default async function UserRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.get<{Params: { id: string }}>('/:id', {
    preHandler: [authMiddleware], schema: {
      description: 'Get user',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: GetUserSchema,
      response: {
        200: UserResponseSchema,
        400: InvalidInputDataErrorSchema,
        401: NoAuthorizationErrorSchema,
        500: InternalServerErrorSchema,
      }
    }}, async (req, reply) => {
    try {
      const { id }  = req.user;
      const data = await userUseCase.getUser(id);
      return reply.status(200).send(data);
    } catch (error) {
      console.error(error);
      handleError(error, reply);
    }
  });

  fastify.log.info('users routes registered');
}