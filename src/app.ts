import express from 'express';
import cors from 'cors';
import * as core from 'express-serve-static-core';

class App {
  public app: core.Express = express();

  constructor() {
    this.config();
  }

  private config(): void {
    this.app.use(cors());
  }
}

export default new App().app;
