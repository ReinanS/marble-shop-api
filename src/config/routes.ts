import { FastifyInstance } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { authMiddleware } from '../middlewares/auth.middleware';

export async function setupRoutes(app: FastifyInstance) {
  const routesPath = path.join(__dirname, '../routes');

  for (const file of fs.readdirSync(routesPath)) {
    if (file.endsWith('.route.ts') || file.endsWith('.route.js')) {
      const route = await import(path.join(routesPath, file));

      const options = {
        prefix: `${file.split('.')[0]}`,
        preHandler: [authMiddleware], 
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