const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const secret = require('@configs/secret');

exports.sha1 = str => crypto.createHash('sha1').update(str).digest('hex').toUpperCase();

exports.encodeToken = (data) => {
  const exp = Date.now() + 60 * 60 * 1000;
  const header = Buffer.from(JSON.stringify({
    type: 'JWT',
    alg: 'HS256',
  })).toString('base64');
  const payload = Buffer.from(JSON.stringify({
    ...data,
    exp,
  })).toString('base64');
  const secretStr = jwt.sign(`${header}.${payload}`, secret.getSecret());
  return `${header}.${payload}.${secretStr}`;
};

exports.decodeToken = (str) => {
  const [header, payload, ...secretStr] = str.split('.');
  if ([header, payload].join('.') === jwt.verify(secretStr.join('.'), secret.getSecret())) {
    return JSON.parse(Buffer.from(payload, 'base64').toString());
  }
  return false;
};
