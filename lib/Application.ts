import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import path from 'path';
import log from '../helpers/log';
import { serviceLoader } from './loader';
import { registerService } from './register';

export default {
  async run(port: number | string, publicKey: string) {
    const app = new Koa();
    app.use(bodyParser());
    const services = await serviceLoader(path.dirname(process.cwd()));
    registerService(app, services, publicKey);
    app.listen(port);
    log.info(`listening ${port}`);
  },
};
