type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
interface IParamOptions {
  defaultValue?: any;
  parse?: string | ((value: any) => any);
  rules?: any;
}
// 参数装饰器入参类别
export interface IParam {
  name: string;
  type: string;
  index: number;
  option?: IParamOptions;
}

// 方法装饰器入参类别
export interface IMethod {
  subUrl: string;
  httpMethod: HttpMethod;
  state?: any;
  params: IParam[];
  isPublic?: boolean;
  fileName?: string;
  pluralize?: boolean;
  midwares?: (() => void)[];
}

export interface IRouter {
  [methodName: string]: IMethod;
}

export interface IClazz {
  baseUrl: string;
  routes: IRouter;
  midwares?: (() => void)[];
}

export const getClazz = (target: any = {}): IClazz => {
  // eslint-disable-next-line no-param-reassign
  target.$Meta = target.$Meta || { baseUrl: '', routes: {} };
  return target.$Meta;
};

export const getMethod = (target: any, methodName: string): IMethod => {
  const meta = getClazz(target);
  const methodMeta = meta.routes[methodName]
    || (meta.routes[methodName] = {
      httpMethod: 'get',
      midwares: [],
      params: [],
      subUrl: '',
    });
  return methodMeta;
};
// 类装饰器
export function Path(baseUrl: string, midwares?: (() => void)[]) {
  return (target: any) => {
    const meta = getClazz(target.prototype);
    meta.baseUrl = baseUrl;
    meta.midwares = midwares;
  };
}
export function PublicMethod(
  target: any,
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptor: PropertyDescriptor,
) {
  const meta = getMethod(target, methodName);
  meta.isPublic = true;
}
export const FileMethod = (fileName: string) => (
  target: any,
  methodName: string,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  descriptor: PropertyDescriptor,
) => {
  const meta = getMethod(target, methodName);
  meta.fileName = fileName;
};

const MethodFactory = (httpMethod: HttpMethod) => (
  url: string,
  option?:
  {
    pluralize?: boolean,
    midwares?: any[],
    state?: any
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
) => (target: any, methodName: string, descriptor: PropertyDescriptor) => {
  const meta = getMethod(target, methodName);
  meta.subUrl = url;
  meta.httpMethod = httpMethod;
  meta.state = option?.state;
  meta.midwares = option?.midwares;
  meta.pluralize = option?.pluralize;
  meta.params.sort((param1: IParam, param2: IParam) => param1.index - param2.index);
};

export const GET = MethodFactory('get');
export const POST = MethodFactory('post');
export const DELETE = MethodFactory('delete');
export const PUT = MethodFactory('put');
export const PATCH = MethodFactory('patch');

const ParamFactory = (paramType: string, paramName?: string, option?: IParamOptions) => (
  target: any,
  methodName: string,
  paramIndex: number,
) => {
  const meta = getMethod(target, methodName);
  meta.params.push({
    index: paramIndex,
    name: paramName || paramType,
    option,
    type: paramType,
  });
};

/**
 * 获取参数装饰器
 * @param paramType 取值类型
 */
function MethodParamFactory(paramType: string) {
  /**
   * 参数装饰器
   * @param paramName 参数名称
   * @param options 参数规则
   */
  function MethodParam(paramName: string, options?: IParamOptions) {
    return ParamFactory(paramType, paramName, options);
  }
  return MethodParam;
}

export const PathParam = MethodParamFactory('path');
export const QueryParam = MethodParamFactory('query');
export const BodyParam = MethodParamFactory('body');
export const CookieParam = MethodParamFactory('cookie');
export const HeaderParam = MethodParamFactory('header');
export const StateParam = MethodParamFactory('state');
export const TokenParam = MethodParamFactory('token');

const ContextParamFactory = (paramType: string) => ParamFactory(paramType);
export const RequestParam = ContextParamFactory('request');
export const ResponseParam = ContextParamFactory('response');
export const ContextParam = ContextParamFactory('context');
export const FileParam = ContextParamFactory('file');
