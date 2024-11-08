// helpers/errorHandler.ts

import { ZodError } from 'zod';
import { FastifyReply } from 'fastify';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

// Define the response structure for errors
type ErrorHandler = (error: Error, reply: FastifyReply) => void;

// Create a map of error types to their handlers
const errorHandlers: Record<string, ErrorHandler> = {
  UserAlreadyExistsError: (error, reply) => {
    reply.status(409).send({ error: error.message });
  },
  ZodError: (error, reply) => {
    reply.status(400).send({ error: 'Invalid input', details: (error as ZodError).errors });
  },

  PrismaClientKnownRequestError: (error, reply) => {
    if (error instanceof PrismaClientKnownRequestError && error.code === 'P2002' ) {
      reply.status(409).send({ error: 'Conflict: Duplicate value found.',
        details: error.meta
      });
    }
  },

  InvalidEmailOrPassword:  (error, reply) => {
    reply.status(401).send({ error: error.message });
  },

  InvalidOrMissingRefreshTokenError:  (error, reply) => {
    reply.status(401).send({ error: error.message });
  },
};

// Generic error handler
export const handleError = (error: unknown, reply: FastifyReply) => {
  console.error(error);

  const errorType = error instanceof Error ? error.constructor.name : "UnknownError";
  const handler = errorHandlers[errorType];

  if (handler) {
    handler(error as Error, reply); // Use type assertion to ensure it's an Error
  } else {
    reply.status(500).send({ error: error });
  }
};
