import ErrorTypes from './ErrorTypes';
export default class Errors extends Error {
    errorCode: ErrorTypes;
    errorMessage: string;
    errors?: Errors[];
    constructor(code: ErrorTypes, message: string, errors?: Errors[]);
}
