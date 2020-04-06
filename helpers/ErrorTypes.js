"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var ErrorTypes;
(function (ErrorTypes) {
    ErrorTypes[ErrorTypes["NOT_HAVE_PERMISSION"] = 0] = "NOT_HAVE_PERMISSION";
    ErrorTypes[ErrorTypes["UNKNOW_ERROR"] = 1] = "UNKNOW_ERROR";
    ErrorTypes[ErrorTypes["RANDOM_PARAM_ERROR"] = 2] = "RANDOM_PARAM_ERROR";
    ErrorTypes[ErrorTypes["PARAMS_ERROR"] = 3] = "PARAMS_ERROR";
    ErrorTypes[ErrorTypes["DECRYPT_DATA_ERROR"] = 4] = "DECRYPT_DATA_ERROR";
})(ErrorTypes || (ErrorTypes = {}));
exports.default = ErrorTypes;
