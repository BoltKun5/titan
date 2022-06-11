import { Router } from 'express';
import * as Routes from './routes';
import { v4 as uuidv4 } from 'uuid';
import { writeJsonSync } from 'fs-extra';

export default (): Router => {
  const app = Router();

  const defaultSwagger = {
    swagger: '2.0',
    info: {
      title: '',
      description: '',
      version: '1.0',
      termsOfService: 'http://swagger.io/terms/',
      contact: {
        email: 'apiteam@swagger.io',
      },
      license: {
        name: 'Apache 2.0',
      },
      url: 'http://www.apache.org/licenses/LICENSE-2.0.html',
    },
    produces: ['application/json'],
    host: 'skynhost.ddns.net:10101',
    basePath: '/api',
    paths: {},
  };

  for (const route in Routes) {
    const tag = `${route.replace('Router', '')}Controller`;
    const routes: {
      path: string;
      method: string;
    }[] = [];
    const router = Routes[route](app);

    router.stack.forEach((elem) => {
      routes.push({
        path: elem.route.path,
        method: Object.keys(elem.route.methods)[0],
      });
    });

    for (const path of routes) {
      if (!defaultSwagger.paths[path.path]) defaultSwagger.paths[path.path] = {};
      defaultSwagger.paths[path.path][path.method] = {
        operationId: uuidv4(),
        tags: [`${tag}`],
        description: 'Just an endpoint',
        parameters: [],
        responses: {},
      };
    }
  }

  writeJsonSync('./swagger.json', defaultSwagger);

  return app;
};
