export declare const sha1: (str: string) => string;
export declare const md5: (str: string) => string;
export declare function encodeToken(data: any, privateKey: string): string;
export declare function decodeToken(str: string, publicKey: string): any;
export declare function randomStr(length: number): string;
export declare function decodeAes(data: string, secretKey: string): string;
export declare function encodeAes(data: string, secretKey: string): string;
export declare function decodeBase64(str: string): string;
export declare function encodeBase64(str: string): string;
export declare function decryptData(data: {
    encryptedData: string;
    iv: string;
    sessionKey: string;
    appId: string;
}): any;
