const Errors = require('@helpers/Errors');

class Result {
  constructor(data, { pagination } = {}) {
    if (data instanceof Errors) {
      this.code = data.code;
      this.message = data.message;
    } else {
      this.code = '0';
      this.data = data;
      this.pagination = pagination;
    }
  }
}
module.exports = Result;
