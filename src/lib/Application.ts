import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import log from '../helpers/log';
import { serviceLoader } from './loader';
import { registerService } from './register';

export { default as  BaseApi} from './BaseApi'
export { Context } from 'koa'
export * from './decorator'

export default class Keyiu {
  private workspace: string;
  private app: Koa;
  constructor(workspace: string) {
    this.workspace = workspace
    this.app = new Koa();
  }
  async run(port: number | string, publicKey: string) {
    this.app.use(bodyParser());
    const services = await serviceLoader(this.workspace);
    registerService(this.app, services, publicKey);
    this.app.listen(port);
    log.info(`listening ${port}`);
  }
  get use() {
    return this.app.use
  }
}

