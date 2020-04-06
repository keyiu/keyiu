import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import log from '../helpers/log';
import { serviceLoader } from './loader';
import { registerService } from './register';

export default class Keyiu {
  private workspace: string;
  constructor(workspace: string) {
    this.workspace = workspace
  }
  async run(port: number | string, publicKey: string) {
    console.log('run');
    const app = new Koa();
    app.use(bodyParser());
    const services = await serviceLoader(this.workspace);
    registerService(app, services, publicKey);
    app.listen(port);
    log.info(`listening ${port}`);
  }
}

