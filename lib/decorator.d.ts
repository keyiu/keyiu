declare type HttpMethod = 'get' | 'post' | 'put' | 'patch' | 'delete';
interface IParamOptions {
    defaultValue?: any;
    parse?: string | ((value: any) => any);
    rules?: any;
}
export interface IParam {
    name: string;
    type: string;
    index: number;
    option?: IParamOptions;
}
export interface IMethod {
    subUrl: string;
    httpMethod: HttpMethod;
    params: IParam[];
    isPublic?: boolean;
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
export declare const getClazz: (target: any) => IClazz;
export declare const getMethod: (target: any, methodName: string) => IMethod;
export declare function Path(baseUrl: string, midwares?: (() => void)[]): (target: any) => void;
export declare function PublicMethod(target: any, methodName: string, descriptor: PropertyDescriptor): void;
export declare const GET: (url: string, midwares?: any[] | undefined) => (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare const POST: (url: string, midwares?: any[] | undefined) => (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare const DELETE: (url: string, midwares?: any[] | undefined) => (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare const PUT: (url: string, midwares?: any[] | undefined) => (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare const PATCH: (url: string, midwares?: any[] | undefined) => (target: any, methodName: string, descriptor: PropertyDescriptor) => void;
export declare const PathParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const QueryParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const BodyParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const CookieParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const HeaderParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const TokenParam: (paramName: string, options?: IParamOptions | undefined) => (target: any, methodName: string, paramIndex: number) => void;
export declare const RequestParam: (target: any, methodName: string, paramIndex: number) => void;
export declare const ResponseParam: (target: any, methodName: string, paramIndex: number) => void;
export declare const ContextParam: (target: any, methodName: string, paramIndex: number) => void;
export {};
