"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var koa_router_1 = __importDefault(require("koa-router"));
var lodash_1 = __importDefault(require("lodash"));
var bytes_1 = __importDefault(require("bytes"));
var Errors_1 = __importDefault(require("../helpers/Errors"));
var ErrorTypes_1 = __importDefault(require("../helpers/ErrorTypes"));
var log_1 = __importDefault(require("../helpers/log"));
var validator_1 = require("../helpers/validator");
var decorator_1 = require("./decorator");
var util_1 = require("../helpers/util");
var crypto_1 = require("helpers/crypto");
/**
 * 从koa中获取相应参数并校验
 * @param ctx koa上下文
 * @param param 参数内容
 */
function extractParameter(ctx, param) {
    var value;
    var error;
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
            return {};
        }
    }
    return {
        result: value,
        error: error,
    };
}
/**
 * 从koa中获取相应参数并校验
 * @param ctx koa上下文
 * @param params 参数内容
 */
function extractParameters(ctx, params) {
    if (!params) {
        return [];
    }
    var result = params.reduce(function (res, param) {
        var _a = extractParameter(ctx, param), res1 = _a.result, error = _a.error;
        if (error) {
            res.errors.push(error);
        }
        else {
            var fr = void 0;
            var parse = param.option && param.option.parse;
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
    }, { values: [], errors: [] });
    if (result.errors.length === 0) {
        return result.values;
    }
    throw new validator_1.ValidatorError('格式校验失败', result.errors);
}
function fnFactory(Service, methodName, method, publicKey) {
    var _this = this;
    return function (ctx) { return __awaiter(_this, void 0, void 0, function () {
        var logs, token, info, startAt, serviceInstance, params, methodParams, result, error_1, time, size, ip, requestLog;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logs = log_1.default;
                    if (!method.isPublic) {
                        token = ctx.header.authorization;
                        if (!token) {
                            ctx.status = 401;
                            ctx.body = new Errors_1.default(ErrorTypes_1.default.NOT_HAVE_PERMISSION, '未登陆');
                            return [2 /*return*/];
                        }
                        info = crypto_1.decodeToken(token, publicKey);
                        if (info === false) {
                            ctx.status = 401;
                            ctx.body = new Errors_1.default(ErrorTypes_1.default.NOT_HAVE_PERMISSION, '未登陆');
                        }
                        logs = logs.child({
                            email: info.email,
                        });
                        ctx.state.tokenInfo = info;
                    }
                    startAt = new Date().getTime();
                    serviceInstance = new Service();
                    params = method.params;
                    methodParams = extractParameters(ctx, params);
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, serviceInstance[methodName].apply(serviceInstance, __spreadArrays(methodParams, [
                            logs,
                        ]))];
                case 2:
                    result = _a.sent();
                    ctx.body = result;
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    if (error_1 instanceof Errors_1.default) {
                        logs.error(error_1);
                        ctx.body = error_1;
                    }
                    else {
                        logs.error(error_1);
                        ctx.status = 500;
                        ctx.body = new Errors_1.default(ErrorTypes_1.default.UNKNOW_ERROR, '网络异常，请检查网络后重试');
                    }
                    return [3 /*break*/, 4];
                case 4:
                    time = new Date().getTime() - startAt;
                    size = (bytes_1.default(ctx.response.length) || '').toLowerCase();
                    ip = util_1.getIpByReq(ctx.req);
                    requestLog = {
                        ip: ip,
                        token: ctx.header.authorization,
                        method: ctx.method,
                        url: ctx.url,
                        time: time,
                        status: ctx.status,
                        size: size,
                        body: ctx.request.rawBody,
                    };
                    console.log(requestLog);
                    return [2 /*return*/];
            }
        });
    }); };
}
function registerService(App, services, publicKey) {
    var _this = this;
    var router = new koa_router_1.default({ prefix: '/api' });
    services.forEach(function (Service) {
        var clazzInfo = decorator_1.getClazz(Service.prototype);
        lodash_1.default.forEach(clazzInfo.routes, function (method, methodName) {
            var path = "" + clazzInfo.baseUrl + method.subUrl;
            router[method.httpMethod](path, fnFactory(Service, methodName, method, publicKey));
        });
    });
    App.use(function (ctx, next) { return __awaiter(_this, void 0, void 0, function () {
        var startAt, ip, size;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    startAt = new Date().getTime();
                    log_1.default.info("<-- " + ctx.method + " " + ctx.url);
                    return [4 /*yield*/, next()];
                case 1:
                    _a.sent();
                    ip = util_1.getIpByReq(ctx.req);
                    size = (bytes_1.default(ctx.response.length) || '').toLowerCase();
                    log_1.default.info("-->" + ip + " " + (new Date().getTime() - startAt) + "ms " + ctx.status + " " + size);
                    return [2 /*return*/];
            }
        });
    }); });
    App.use(router.routes());
}
exports.registerService = registerService;
exports.default = {
    registerService: registerService,
};
