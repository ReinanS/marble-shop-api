import cors from "@fastify/cors";
import fastify from "fastify";
import { setupJWT, setupRoutes, setupSwagger } from "./config";

export async function setupApp() {
  const app = fastify({ logger: true })

  app.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  });

  setupJWT(app);
  setupSwagger(app);
  await setupRoutes(app);

  return app;
}