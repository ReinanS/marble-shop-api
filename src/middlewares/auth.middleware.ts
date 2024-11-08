import { FastifyJWT } from "@fastify/jwt";
import { FastifyReply, FastifyRequest } from "fastify";

export async function authMiddleware(req: FastifyRequest, reply: FastifyReply) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return reply.status(401).send( { message: 'No authorization header'})
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      return reply.status(401).send({ message: 'Invalid token format' });
    }

    const decoded = req.jwt.verify<FastifyJWT['user']>(token);
    req.user = decoded;
    
  } catch (error) {
    console.error(error);
    return reply.status(401).send( { message: 'Invalid or expired access token'})
  }
}
