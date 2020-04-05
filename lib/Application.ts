import * as Koa from 'koa';
import * as bodyParser from 'koa-bodyparser';
import * as path from 'path';
import * as moment from 'moment-timezone';
import log from '../helpers/log';
import { serviceLoader } from './loader';
import { registerService } from './register';

moment.tz.setDefault('Asia/Shanghai');

export default {
  async run(port: number | string) {
    const app = new Koa();
    app.use(bodyParser());
    const services = await serviceLoader(path.dirname(module.parent.filename));
    registerService(app, services);
    app.listen(port);
    log.info(`listening ${port}`);
  },
};
