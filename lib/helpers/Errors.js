class Errors extends Error {
  constructor(code, message) {
    super();
    console.log(code, message);
    this.code = code;
    this.error = new Error(message);
    this.message = message;
  }
}
module.exports = Errors;
