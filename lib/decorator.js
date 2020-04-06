"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClazz = function (target) {
    // eslint-disable-next-line
    target.$Meta = target.$Meta || { baseUrl: "", routes: {} };
    return target.$Meta;
};
exports.getMethod = function (target, methodName) {
    var meta = exports.getClazz(target);
    var methodMeta = meta.routes[methodName] ||
        (meta.routes[methodName] = {
            httpMethod: 'get',
            midwares: [],
            params: [],
            subUrl: '',
        });
    return methodMeta;
};
// 类装饰器
function Path(baseUrl, midwares) {
    return function (target) {
        var meta = exports.getClazz(target.prototype);
        meta.baseUrl = baseUrl;
        meta.midwares = midwares;
    };
}
exports.Path = Path;
function PublicMethod(target, methodName, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
descriptor) {
    var meta = exports.getMethod(target, methodName);
    meta.isPublic = true;
}
exports.PublicMethod = PublicMethod;
var MethodFactory = function (httpMethod) { return function (url, midwares) { return function (target, methodName, descriptor) {
    var meta = exports.getMethod(target, methodName);
    meta.subUrl = url;
    meta.httpMethod = httpMethod;
    meta.midwares = midwares;
    meta.params.sort(function (param1, param2) { return param1.index - param2.index; });
}; }; };
exports.GET = MethodFactory('get');
exports.POST = MethodFactory('post');
exports.DELETE = MethodFactory('delete');
exports.PUT = MethodFactory('put');
exports.PATCH = MethodFactory('patch');
var ParamFactory = function (paramType, paramName, option) { return function (target, methodName, paramIndex) {
    var meta = exports.getMethod(target, methodName);
    meta.params.push({
        index: paramIndex,
        name: paramName || paramType,
        option: option,
        type: paramType,
    });
}; };
/**
 * 获取参数装饰器
 * @param paramType 取值类型
 */
function MethodParamFactory(paramType) {
    /**
     * 参数装饰器
     * @param paramName 参数名称
     * @param options 参数规则
     */
    function MethodParam(paramName, options) {
        return ParamFactory(paramType, paramName, options);
    }
    return MethodParam;
}
exports.PathParam = MethodParamFactory('path');
exports.QueryParam = MethodParamFactory('query');
exports.BodyParam = MethodParamFactory('body');
exports.CookieParam = MethodParamFactory('cookie');
exports.HeaderParam = MethodParamFactory('header');
exports.TokenParam = MethodParamFactory('token');
var ContextParamFactory = function (paramType) { return ParamFactory(paramType); };
exports.RequestParam = ContextParamFactory('request');
exports.ResponseParam = ContextParamFactory('response');
exports.ContextParam = ContextParamFactory('context');
