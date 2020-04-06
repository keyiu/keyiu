export declare enum DataTypes {
    STRING = 0,
    NUMBER = 1,
    BOOLEAN = 2,
    METHOD = 3,
    REGEXP = 4,
    INTEGER = 5,
    FLOAT = 6,
    ARRAY = 7,
    OBJECT = 8,
    ENUM = 9,
    DATE = 10,
    URL = 11,
    HEX = 12,
    EMAIL = 13
}
export declare class ValidatorError extends Error {
    message: string;
    error: ValidatorError | ValidatorError[] | undefined;
    constructor(message: string, error?: ValidatorError | ValidatorError[]);
}
export default function validator(value: any, rules: any): void;
