import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import { encodeToken, decodeToken } from '../helpers/crypto';
import { serviceLoader } from './loader';
import { registerService } from './register';
import log from '../helpers/log';

export { default as log } from '../helpers/log';
export { default as BaseApi } from './BaseApi';
export { default as Errors } from '../helpers/Errors';
export { default as SystemErrors } from '../helpers/ErrorTypes';
export { Context, Next } from 'koa';
export {
  sha1,
  md5,
  randomStr,
  decodeAes,
  encodeAes,
  decodeBase64,
  encodeBase64,
  decryptData,
} from '../helpers/crypto';
export * from './decorator';

export default class Keyiu {
  private workspace: string;

  private _app: Koa;

  publicKey: string

  privateKey: string

  private globalBeforeCallHooks: ((ctx: Koa.Context) => Promise<void>)[]= []

  constructor(workspace: string, key: {publicKey: string, privateKey: string}) {
    this.workspace = workspace;
    this._app = new Koa();
    this.privateKey = key.privateKey;
    this.publicKey = key.publicKey;
  }

  addGlobalBeforeCallHook(fn: (ctx: Koa.Context) => Promise<void>) {
    this.globalBeforeCallHooks.push(fn);
  }

  async run(port: number | string) {
    this._app.use(bodyParser());
    const services = await serviceLoader(this.workspace);
    registerService(this._app, services, {
      globalBeforeCallHooks: this.globalBeforeCallHooks,
    }, this.publicKey);
    this._app.listen(port);
    log.info(`listening ${port}`);
  }

  get app(): Koa {
    return this._app;
  }

  decodeToken(str: string) {
    return decodeToken(str, this.publicKey);
  }

  encodeToken(data: any) {
    return encodeToken(data, this.privateKey);
  }
}
