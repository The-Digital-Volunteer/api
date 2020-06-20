import 'dotenv/config';
import { urlencoded, json } from 'body-parser';
import express from 'express';
import helmet from 'helmet';
import { Server } from 'http';
import cors from 'cors';

import routes from './routes';
import './database';

class App {
  constructor() {
    this.server = express();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.server.use(cors());
    this.server.use(helmet({
      dnsPrefetchControl: false,
      frameguard: false,
      ieNoOpen: false,
    }));
    this.server.use(urlencoded({ extended: false }));
    this.server.use(json());
  }

  routes() {
    this.server.use(routes);
  }
}

const app = new App();
const server = Server(app.server);

export default server;
