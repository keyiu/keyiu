"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var crypto = __importStar(require("crypto"));
var jwt = __importStar(require("jsonwebtoken"));
var crypto_js_1 = require("crypto-js");
var ErrorTypes_1 = __importDefault(require("./ErrorTypes"));
var Errors_1 = __importDefault(require("./Errors"));
exports.sha1 = function (str) {
    return crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
};
exports.md5 = function (str) {
    return crypto.createHash('md5').update(str).digest('hex').toUpperCase();
};
function encodeToken(data, privateKey) {
    var exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
    var header = Buffer.from(JSON.stringify({
        alg: 'ES256',
        type: 'JWT',
        v: 1,
    })).toString('base64');
    var payload = Buffer.from(JSON.stringify(__assign(__assign({}, data), { exp: exp }))).toString('base64');
    var secretStr = jwt.sign(header + "." + payload, privateKey, { algorithm: 'ES256' });
    return header + "." + payload + "." + secretStr;
}
exports.encodeToken = encodeToken;
function decodeToken(str, publicKey) {
    var _a = str.split('.'), header = _a[0], payload = _a[1], secretStr = _a.slice(2);
    var info = JSON.parse(Buffer.from(payload, 'base64').toString());
    if (info.exp < Date.now()) {
        return false;
    }
    if ([header, payload].join('.') ===
        jwt.verify(secretStr.join('.'), publicKey, { algorithms: ['ES256'] })) {
        return info;
    }
    return false;
}
exports.decodeToken = decodeToken;
function randomStr(length) {
    var str = '';
    while (str.length < length) {
        str += Math.random().toString(32).substr(2).toUpperCase();
    }
    return str.slice(0, length);
}
exports.randomStr = randomStr;
function decodeAes(data, secretKey) {
    var decrypt = crypto_js_1.AES.decrypt(data, crypto_js_1.enc.Utf8.parse(secretKey), {
        mode: crypto_js_1.mode.ECB,
        padding: crypto_js_1.pad.Pkcs7,
    });
    return decrypt.toString(crypto_js_1.enc.Utf8);
}
exports.decodeAes = decodeAes;
function encodeAes(data, secretKey) {
    var res = crypto_js_1.AES.encrypt(data, crypto_js_1.enc.Utf8.parse(secretKey), {
        mode: crypto_js_1.mode.ECB,
        padding: crypto_js_1.pad.Pkcs7,
    });
    return res.toString();
}
exports.encodeAes = encodeAes;
function decodeBase64(str) {
    return Buffer.from(str, 'base64').toString();
}
exports.decodeBase64 = decodeBase64;
function encodeBase64(str) {
    return Buffer.from(str).toString('base64');
}
exports.encodeBase64 = encodeBase64;
function decryptData(data) {
    var _encryptedData = data.encryptedData, _iv = data.iv, _sessionKey = data.sessionKey, appId = data.appId;
    var sessionKey = Buffer.from(_sessionKey, 'base64');
    var encryptedData = Buffer.from(_encryptedData, 'base64');
    var iv = Buffer.from(_iv, 'base64');
    try {
        // 解密
        var decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
        // 设置自动 padding 为 true，删除填充补位
        decipher.setAutoPadding(true);
        var decoded = decipher.update(encryptedData, 'binary', 'utf8');
        decoded += decipher.final('utf8');
        var decodedObj = JSON.parse(decoded);
        if (decodedObj.watermark.appid !== appId) {
            throw new Errors_1.default(ErrorTypes_1.default.DECRYPT_DATA_ERROR, 'Illegal Buffer');
        }
        return decodedObj;
    }
    catch (err) {
        throw new Errors_1.default(ErrorTypes_1.default.DECRYPT_DATA_ERROR, 'Illegal Buffer');
    }
}
exports.decryptData = decryptData;
