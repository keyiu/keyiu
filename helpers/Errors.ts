import ErrorTypes from './ErrorTypes';

export default class Errors extends Error {
  errorCode: ErrorTypes;

  errorMessage: string;

  errors: Errors[];

  constructor(code: ErrorTypes, message: string, errors?: Errors[]) {
    super(message);
    this.errorCode = code;
    this.errorMessage = message;
    this.errors = errors;
  }
}
