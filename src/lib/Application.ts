import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { serviceLoader } from './loader';
import { registerService } from './register';
import log from '../helpers/log';

export { default as log } from '../helpers/log';
export { default as BaseApi } from './BaseApi';
export { default as Errors } from '../helpers/Errors';
export { default as SystemErrors } from '../helpers/ErrorTypes';
export { Context } from 'koa';
export * from './decorator';

export default class Keyiu {
  private workspace: string;

  private _app: Koa;

  private globalBeforeCallHooks: ((ctx: Koa.Context) => Promise<void>)[]= []

  constructor(workspace: string) {
    this.workspace = workspace;
    this._app = new Koa();
  }

  addGlobalBeforeCallHook(fn: (ctx: Koa.Context) => Promise<void>) {
    this.globalBeforeCallHooks.push(fn);
  }

  async run(port: number | string, publicKey: string) {
    this._app.use(bodyParser());
    const services = await serviceLoader(this.workspace);
    registerService(this._app, services, {
      globalBeforeCallHooks: this.globalBeforeCallHooks,
    }, publicKey);
    this._app.listen(port);
    log.info(`listening ${port}`);
  }

  get app() {
    return this._app;
  }
}
