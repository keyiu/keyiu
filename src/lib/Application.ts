import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { serviceLoader } from './loader';
import { registerService } from './register';
import log from '../helpers/log';

export { default as log } from '../helpers/log';
export { default as  BaseApi} from './BaseApi'
export { Context } from 'koa'
export { default as Errors} from '../helpers/Errors'
export * from './decorator'

export default class Keyiu {
  private workspace: string;
  private _app: Koa;
  constructor(workspace: string) {
    this.workspace = workspace
    this._app = new Koa();
  }
  async run(port: number | string, publicKey: string) {
    this._app.use(bodyParser());
    const services = await serviceLoader(this.workspace);
    registerService(this._app, services, publicKey);
    this._app.listen(port);
    log.info(`listening ${port}`);
  }
  get app() {
    return this._app;
  }
}

