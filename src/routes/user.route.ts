import { FastifyInstance } from "fastify";
import { UserUseCase } from "../usecases/user.usecase";
import { handleError } from "../helpers/errors/error-handle.error";
import { authMiddleware } from "../middlewares/auth.middleware";
import { UserIdSchema, InternalServerErrorSchema, InvalidInputDataErrorSchema, NoAuthorizationErrorSchema, UserNotFoundErrorSchema, UserResponseSchema } from "../schemas";

export default async function UserRoutes(fastify: FastifyInstance) {
  const userUseCase = new UserUseCase(fastify);

  fastify.get<{Params: { id: string }}>('/:id', {
    preHandler: [authMiddleware], schema: {
      description: 'Get user',
      tags: ['Users'],
      security: [{ bearerAuth: [] }],
      params: UserIdSchema,
      response: {
        200: UserResponseSchema,
        400: InvalidInputDataErrorSchema,
        401: NoAuthorizationErrorSchema,
        404: UserNotFoundErrorSchema,
        500: InternalServerErrorSchema,
      }
    }}, async (req, reply) => {
    try {
      const { id }   = req.params;
      const data = await userUseCase.getUser(id);
      return reply.status(200).send(data);
    } catch (error) {
      handleError(error, reply);
    }
  });

  fastify.log.info('users routes registered');
}