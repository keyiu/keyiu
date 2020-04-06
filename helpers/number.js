"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var Errors_1 = __importDefault(require("./Errors"));
var ErrorTypes_1 = __importDefault(require("./ErrorTypes"));
var seed = [6, 8, 9];
function random(min, max) {
    if (max - min < 10) {
        throw new Errors_1.default(ErrorTypes_1.default.RANDOM_PARAM_ERROR, '参数不满足计算条件');
    }
    var seedNum = Math.floor((Math.random() * (max - min) + min) / 10);
    var last = seed[Math.floor(Math.random() * seed.length)];
    var num = seedNum * 10 + last;
    if (num < min || num >= max) {
        num = random(min, max);
    }
    return num;
}
exports.random = random;
function randomSplit(total, n, minV, maxV) {
    var rem = total % n;
    var av = total / n;
    if (minV > av || maxV < av) {
        throw new Errors_1.default(ErrorTypes_1.default.PARAMS_ERROR, '最大值不能小于平局数，最小值不能大于平均值');
    }
    av = Math.floor(av);
    var res = [];
    for (var index = 0; index < n; index += 1) {
        res.push(av);
    }
    res[0] += rem;
    for (var index = 0; index < res.length; index += 1) {
        var v = res[index];
        var randomIndex = Math.floor(Math.random() * res.length);
        var randomV = res[randomIndex];
        var sum = v + randomV;
        if (sum <= 11) {
            var v1 = Math.floor(Math.random() * sum) + 1;
            var v2 = sum - v1;
            if (v1 >= 1 && v2 >= 1 && randomIndex !== index) {
                res[index] = v1;
                res[randomIndex] = sum - v1;
            }
        }
        else {
            var v1 = random(1, sum);
            var v2 = sum - v1;
            if (v1 >= 1 && v2 >= 1 && randomIndex !== index) {
                res[index] = v1;
                res[randomIndex] = sum - v1;
            }
        }
    }
    return res;
}
exports.randomSplit = randomSplit;
exports.default = {
    random: random,
    randomSplit: randomSplit,
};
