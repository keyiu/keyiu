import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import { AES, mode, pad, enc } from 'crypto-js';
import config from '~config/config';
import ErrorTypes from './ErrorTypes';
import Errors from './Errors';

export const sha1 = (str: string) =>
  crypto.createHash('sha1').update(str).digest('hex').toUpperCase();
export const md5 = (str: string) =>
  crypto.createHash('md5').update(str).digest('hex').toUpperCase();

export function encodeToken(data: any) {
  const exp = Date.now() + 7 * 24 * 60 * 60 * 1000;
  const header = Buffer.from(
    JSON.stringify({
      alg: 'ES256',
      type: 'JWT',
      v: 1,
    }),
  ).toString('base64');
  const payload = Buffer.from(
    JSON.stringify({
      ...data,
      exp,
    }),
  ).toString('base64');
  const secretStr = jwt.sign(`${header}.${payload}`, config.Key.privateKey, { algorithm: 'ES256' });
  return `${header}.${payload}.${secretStr}`;
}

export function decodeToken(str: string) {
  const [header, payload, ...secretStr] = str.split('.');
  const info = JSON.parse(Buffer.from(payload, 'base64').toString());
  if (info.exp < Date.now()) {
    return false;
  }
  if (
    [header, payload].join('.') ===
    jwt.verify(secretStr.join('.'), config.Key.publicKey, { algorithms: ['ES256'] })
  ) {
    return info;
  }
  return false;
}

export function randomStr(length: number) {
  let str = '';
  while (str.length < length) {
    str += Math.random().toString(32).substr(2).toUpperCase();
  }
  return str.slice(0, length);
}

export function decodeAes(data: string, secretKey: string) {
  const decrypt = AES.decrypt(data, enc.Utf8.parse(secretKey), {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  });
  return decrypt.toString(enc.Utf8);
}
export function encodeAes(data: string, secretKey: string) {
  const res = AES.encrypt(data, enc.Utf8.parse(secretKey), {
    mode: mode.ECB,
    padding: pad.Pkcs7,
  });
  return res.toString();
}

export function decodeBase64(str: string) {
  return Buffer.from(str, 'base64').toString();
}
export function encodeBase64(str: string) {
  return Buffer.from(str).toString('base64');
}
export function decryptData(data: {
  encryptedData: string;
  iv: string;
  sessionKey: string;
  appId: string;
}) {
  const { encryptedData: _encryptedData, iv: _iv, sessionKey: _sessionKey, appId } = data;
  const sessionKey = Buffer.from(_sessionKey, 'base64');
  const encryptedData = Buffer.from(_encryptedData, 'base64');
  const iv = Buffer.from(_iv, 'base64');
  try {
    // 解密
    const decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv);
    // 设置自动 padding 为 true，删除填充补位
    decipher.setAutoPadding(true);
    let decoded = decipher.update(encryptedData, 'binary', 'utf8');
    decoded += decipher.final('utf8');
    const decodedObj = JSON.parse(decoded);
    if (decodedObj.watermark.appid !== appId) {
      throw new Errors(ErrorTypes.DECRYPT_DATA_ERROR, 'Illegal Buffer');
    }
    return decodedObj;
  } catch (err) {
    throw new Errors(ErrorTypes.DECRYPT_DATA_ERROR, 'Illegal Buffer');
  }
}
