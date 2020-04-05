import * as _ from 'lodash';

export enum DataTypes {
  STRING,
  NUMBER,
  BOOLEAN,
  METHOD,
  REGEXP,
  INTEGER,
  FLOAT,
  ARRAY,
  OBJECT,
  ENUM,
  DATE,
  URL,
  HEX,
  EMAIL,
}
export class ValidatorError extends Error {
  public message: string;

  public error: ValidatorError | ValidatorError[];

  constructor(message: string, error?: ValidatorError | ValidatorError[]) {
    super();
    super.message = message;
    this.message = message;
    this.error = error;
  }
}

export default function validator(value: any, rules: any) {
  if (_.isArray(rules)) {
    rules.reduce(
      (result: any, rule) => {
        validator(value, rule);
        return result;
      },
      { result: [], error: [] },
    );
  }
}
