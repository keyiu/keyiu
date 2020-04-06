"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = __importStar(require("lodash"));
var DataTypes;
(function (DataTypes) {
    DataTypes[DataTypes["STRING"] = 0] = "STRING";
    DataTypes[DataTypes["NUMBER"] = 1] = "NUMBER";
    DataTypes[DataTypes["BOOLEAN"] = 2] = "BOOLEAN";
    DataTypes[DataTypes["METHOD"] = 3] = "METHOD";
    DataTypes[DataTypes["REGEXP"] = 4] = "REGEXP";
    DataTypes[DataTypes["INTEGER"] = 5] = "INTEGER";
    DataTypes[DataTypes["FLOAT"] = 6] = "FLOAT";
    DataTypes[DataTypes["ARRAY"] = 7] = "ARRAY";
    DataTypes[DataTypes["OBJECT"] = 8] = "OBJECT";
    DataTypes[DataTypes["ENUM"] = 9] = "ENUM";
    DataTypes[DataTypes["DATE"] = 10] = "DATE";
    DataTypes[DataTypes["URL"] = 11] = "URL";
    DataTypes[DataTypes["HEX"] = 12] = "HEX";
    DataTypes[DataTypes["EMAIL"] = 13] = "EMAIL";
})(DataTypes = exports.DataTypes || (exports.DataTypes = {}));
var ValidatorError = /** @class */ (function (_super) {
    __extends(ValidatorError, _super);
    function ValidatorError(message, error) {
        var _this = _super.call(this, message) || this;
        _this.message = message;
        _this.error = error;
        return _this;
    }
    return ValidatorError;
}(Error));
exports.ValidatorError = ValidatorError;
function validator(value, rules) {
    if (_.isArray(rules)) {
        rules.reduce(function (result, rule) {
            validator(value, rule);
            return result;
        }, { result: [], error: [] });
    }
}
exports.default = validator;
