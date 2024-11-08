import { FastifyInstance } from "fastify";
import fjwt from '@fastify/jwt'
import fCookie from '@fastify/cookie'
import { JWT_SECRET_KEY } from "../helpers";

export function setupJWT(app: FastifyInstance) {
   app.register(fjwt, { secret: JWT_SECRET_KEY });

    app.addHook('preHandler', (req, _, next) => {
      req.jwt = app.jwt
      return next()
    });

    app.register(fCookie, {
      secret: JWT_SECRET_KEY,
      hook: "preHandler",
    });
}