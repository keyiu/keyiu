import { Context, Next } from 'koa';
import * as Router from 'koa-router';
import * as _ from 'lodash';
import { decodeToken } from '../helpers/crypto';
import Errors from '../helpers/Errors';
import ErrorTypes from '../helpers/ErrorTypes';
import log from '../helpers/log';
import { ValidatorError } from '../helpers/validator';
import { getClazz, IClazz, IMethod, IParam } from './decorator';
import { getIpByReq } from '../helpers/util';
import bytes from 'bytes'

interface IExtractParameterResult {
  result: any;
  error: any
}
/**
 * 从koa中获取相应参数并校验
 * @param ctx koa上下文
 * @param param 参数内容
 */
function extractParameter(ctx: Router.RouterContext, param: IParam): IExtractParameterResult {
  let value;
  let error;
  switch (param.type) {
    case 'query': {
      value = ctx.query[param.name];
      break;
    }
    case 'path': {
      value = ctx.params[param.name];
      break;
    }
    case 'form': {
      value = ctx.query[param.name];
      break;
    }
    case 'cookie': {
      value = ctx.query[param.name];
      break;
    }
    case 'header': {
      value = ctx.request.header;
      break;
    }
    case 'body': {
      value = ctx.request.body[param.name];
      break;
    }
    case 'token': {
      value = ctx.state.tokenInfo[param.name];
      break;
    }
    case 'context': {
      value = ctx;
      break;
    }
    default: {
      return value;
    }
  }
  return {
    result: value,
    error: error
  };
}
/**
 * 从koa中获取相应参数并校验
 * @param ctx koa上下文
 * @param params 参数内容
 */
function extractParameters(ctx: Router.RouterContext, params: IParam[]): [] {
  if (!params) {
    return [];
  }
  const result = params.reduce(
    (res: any, param) => {
      const { result: res1, error } = extractParameter(ctx, param);
      if (error) {
        res.errors.push(error);
      } else {
        let fr;
        const parse = param.option && param.option.parse;
        if (typeof parse === 'function') {
          fr = parse(res1);
        }
        if (typeof parse === 'string') {
          switch (parse) {
            case 'string':
              fr = res1.toString();
              break;
            case 'number':
              fr = Number(res1);
              break;
            default:
              fr = res1;
          }
        }
        fr = fr || res1;
        if (!fr && param.option && param.option.defaultValue) {
          fr = param.option && param.option.defaultValue;
        }
        res.values.push(fr);
      }
      return res;
    },
    { values: [], errors: [] },
  );

  if (result.errors.length === 0) {
    return result.values;
  }
  throw new ValidatorError('格式校验失败', result.errors);
}

function fnFactory(Service: any, methodName: string, method: IMethod) {
  return async (ctx: Router.RouterContext) => {
    let logs = log;
    if (!method.isPublic) {
      const token = ctx.header.authorization;
      if (!token) {
        ctx.status = 401;
        ctx.body = new Errors(ErrorTypes.NOT_HAVE_PERMISSION, '未登陆');
        return;
      }
      const info = decodeToken(token);
      if (info === false) {
        ctx.status = 401;
        ctx.body = new Errors(ErrorTypes.NOT_HAVE_PERMISSION, '未登陆');
      }
      logs = logs.child({
        email: info.email,
      });
      ctx.state.tokenInfo = info;
    }
    const startAt = new Date().getTime();
    const serviceInstance = new Service();
    const { params } = method;
    const methodParams = extractParameters(ctx, params);
    try {
      const result = await serviceInstance[methodName].apply(serviceInstance, [
        ...methodParams,
        logs,
      ]);
      ctx.body = result;
    } catch (error) {
      if (error instanceof Errors) {
        logs.error(error);
        ctx.body = error;
      } else {
        logs.error(error);
        ctx.status = 500;
        ctx.body = new Errors(ErrorTypes.UNKNOW_ERROR, '网络异常，请检查网络后重试');
      }
    }
    const time = new Date().getTime() - startAt;
    const size = (bytes(ctx.response.length) || '').toLowerCase();
    const ip = getIpByReq(ctx.req);
    const requestLog = {
      ip,
      token: ctx.header.authorization,
      method: ctx.method,
      url: ctx.url,
      time,
      status: ctx.status,
      size,
      body: ctx.request.rawBody,
    };
    console.log(requestLog);
  };
}

export function registerService(App: any, services: any[]) {
  const router = new Router({ prefix: '/api' });
  services.forEach((Service) => {
    const clazzInfo: IClazz = getClazz(Service.prototype);
    _.forEach(clazzInfo.routes, (method: IMethod, methodName: string) => {
      const path = `${clazzInfo.baseUrl}${method.subUrl}`;
      router[method.httpMethod](path, fnFactory(Service, methodName, method));
    });
  });
  App.use(async (ctx: Context, next: Next) => {
    const startAt = new Date().getTime();
    log.info(`<-- ${ctx.method} ${ctx.url}`);
    await next();
    const ip = getIpByReq(ctx.req);
    const size = (bytes(ctx.response.length) || '').toLowerCase();
    log.info(`-->${ip} ${new Date().getTime() - startAt}ms ${ctx.status} ${size}`);
  });
  App.use(router.routes());
}

export default {
  registerService,
};
