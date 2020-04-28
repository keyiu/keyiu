import ErrorTypes from './ErrorTypes';

export default class Errors extends Error {
  errorCode: number;

  errorMessage: string;

  errors?: Errors[];

  constructor(code: number, message: string, errors?: Errors[]) {
    super(message);
    this.errorCode = code;
    this.errorMessage = message;
    this.errors = errors;
  }
}
