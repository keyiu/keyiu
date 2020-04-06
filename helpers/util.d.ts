import { Context } from 'koa';
export declare function stringifyQuery(query: any): string;
export declare function parseQuery(queryString: string): any;
export declare function pagination2sql(options: {
    pageNum: number;
    pageSize: number;
}): {
    limit: number;
    offset: number;
};
export declare function sql2pagination(options: {
    pageNum: number;
    pageSize: number;
    count: number;
}): {
    pageNum: number;
    pageSize: number;
    total: number;
};
export declare function getIpByReq(req: any): string;
export declare function toHump(name: string): string;
export declare function toLine(name: string): string;
export declare function objKeystoLine(obj: any): any;
export declare function getRawBody(ctx: Context, encode?: string): Promise<string>;
export declare function encodeGbk(str: string): string;
export declare function wait(time: number): Promise<any>;
