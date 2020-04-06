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
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var qs = __importStar(require("qs"));
var iconv = __importStar(require("iconv-lite"));
var querystring = __importStar(require("querystring"));
function stringifyQuery(query) {
    return qs.stringify(query);
}
exports.stringifyQuery = stringifyQuery;
function parseQuery(queryString) {
    var query = qs.parse(queryString);
    return query;
}
exports.parseQuery = parseQuery;
function pagination2sql(options) {
    var newPageSize = Number(options.pageSize) || 20;
    var newPageNum = Number(options.pageNum) || 1;
    return {
        limit: newPageSize,
        offset: newPageSize * (newPageNum - 1) || 0,
    };
}
exports.pagination2sql = pagination2sql;
function sql2pagination(options) {
    return {
        pageNum: Number(options.pageNum) || 1,
        pageSize: Number(options.pageSize) || 20,
        total: options.count,
    };
}
exports.sql2pagination = sql2pagination;
function getIpByReq(req) {
    var ipStr = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    return _.last(ipStr.split(':'));
}
exports.getIpByReq = getIpByReq;
function toHump(name) {
    return name.replace(/_(\w)/g, function (all, letter) { return letter.toUpperCase(); });
}
exports.toHump = toHump;
// 驼峰转换下划线
function toLine(name) {
    return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
exports.toLine = toLine;
function objKeystoLine(obj) {
    return _.reduce(obj, function (r, v, k) {
        // eslint-disable-next-line
        r[toLine(k)] = v;
        return r;
    }, {});
}
exports.objKeystoLine = objKeystoLine;
function getRawBody(ctx, encode) {
    if (encode === void 0) { encode = 'utf8'; }
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            ctx.req.setEncoding(encode);
            return [2 /*return*/, new Promise(function (resolve) {
                    var buf = '';
                    ctx.req.on('data', function (chunk) {
                        buf += chunk;
                    });
                    ctx.req.on('end', function () {
                        resolve(buf);
                    });
                })];
        });
    });
}
exports.getRawBody = getRawBody;
function encodeGbk(str) {
    // eslint-disable-next-line no-control-regex
    var chinese = new RegExp(/[^\x00-\xff]/g);
    var gbkBuffer = null;
    var i = 0;
    var tempStr = '';
    if (chinese.test(str)) {
        gbkBuffer = iconv.encode(str, 'gbk');
        for (i; i < gbkBuffer.length; i += 1) {
            tempStr += "%" + gbkBuffer[i].toString(16);
        }
        tempStr = tempStr.toUpperCase();
        return tempStr;
    }
    return querystring.escape(str);
}
exports.encodeGbk = encodeGbk;
function wait(time) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve) {
                    setTimeout(function () {
                        resolve();
                    }, time);
                })];
        });
    });
}
exports.wait = wait;
