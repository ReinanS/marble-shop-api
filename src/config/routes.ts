import { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { authMiddleware } from '../middlewares/auth.middleware';

export async function setupRoutes(app: FastifyInstance) {
  const routesPath = path.join(__dirname, '../routes');

  for (const file of fs.readdirSync(routesPath)) {
    if (file.endsWith('.route.ts') || file.endsWith('.route.js')) {
      const route = await import(path.join(routesPath, file));

      const isUserRoute = file === 'user.route.ts';
      const options = {
        prefix: `${file.split('.')[0]}`,
        // Aplica middleware em todas as rotas, menos user.route.ts
        preHandler: isUserRoute ? [] : [authMiddleware], 
      };

      if (typeof route.default === 'function') {
        app.register(route.default, options);
      } else {
        console.warn(`O arquivo ${file} não exporta uma função padrão para registro.`);
      }
    }
  }

  app.get('/healthcheck', (req, res) => {
    res.send({ message: 'Success' })
  });
}