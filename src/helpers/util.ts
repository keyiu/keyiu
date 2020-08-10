import { Context } from 'koa';
import _ from 'lodash';
import qs from 'qs';
import iconv from 'iconv-lite';
import querystring from 'querystring';

export function stringifyQuery(query: any) {
  return qs.stringify(query);
}
export function parseQuery(queryString: string) {
  const query = qs.parse(queryString);
  return query;
}
export function pagination2sql(options: { pageNum: number; pageSize: number }) {
  const newPageSize = Number(options.pageSize) || 20;
  const newPageNum = Number(options.pageNum) || 1;
  return {
    limit: newPageSize,
    offset: newPageSize * (newPageNum - 1) || 0,
  };
}

export function sql2pagination(options: { pageNum: number; pageSize: number; count: number }) {
  return {
    pageNum: Number(options.pageNum) || 1,
    pageSize: Number(options.pageSize) || 20,
    total: options.count,
  };
}

export function getIpByReq(req: any): string {
  const ipStr: string = req.headers['x-forwarded-for']
    || req.connection?.remoteAddress
    || req.socket?.remoteAddress
    || req.connection?.socket?.remoteAddress;
  return _.last((ipStr || '').split(':')) || '';
}

export function toHump(name: string) {
  return name.replace(/_(\w)/g, (all, letter) => letter.toUpperCase());
}
// 驼峰转换下划线
export function toLine(name: string) {
  return name.replace(/([A-Z])/g, '_$1').toLowerCase();
}
export function objKeystoLine(obj: any) {
  return _.reduce(
    obj,
    (r: any, v: string, k: string) => {
      // eslint-disable-next-line
      r[toLine(k)] = v;
      return r;
    },
    {},
  );
}
export async function getRawBody(ctx: Context, encode: BufferEncoding = 'utf8'): Promise<string> {
  ctx.req.setEncoding(encode);
  return new Promise((resolve) => {
    let buf = '';
    ctx.req.on('data', (chunk: string) => {
      buf += chunk;
    });
    ctx.req.on('end', () => {
      resolve(buf);
    });
  });
}

export function encodeGbk(str: string) {
  // eslint-disable-next-line no-control-regex
  const chinese = new RegExp(/[^\x00-\xff]/g);
  let gbkBuffer = null;
  let i = 0;
  let tempStr = '';
  if (chinese.test(str)) {
    gbkBuffer = iconv.encode(str, 'gbk');
    for (i; i < gbkBuffer.length; i += 1) {
      tempStr += `%${gbkBuffer[i].toString(16)}`;
    }
    tempStr = tempStr.toUpperCase();
    return tempStr;
  }
  return querystring.escape(str);
}
export async function wait(time: number): Promise<any> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
