import { JWT } from '@fastify/jwt'

declare module 'fastify' {
  interface FastifyRequest {
    jwt: JWT
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserPayload
  }
}
