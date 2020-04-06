import Errors from './Errors';
import ErrorTypes from './ErrorTypes';

const seed = [6, 8, 9];
export function random(min: number, max: number) {
  if (max - min < 10) {
    throw new Errors(ErrorTypes.RANDOM_PARAM_ERROR, '参数不满足计算条件');
  }
  const seedNum = Math.floor((Math.random() * (max - min) + min) / 10);
  const last = seed[Math.floor(Math.random() * seed.length)];
  let num = seedNum * 10 + last;
  if (num < min || num >= max) {
    num = random(min, max);
  }
  return num;
}

export function randomSplit(total: number, n: number, minV: number, maxV: number) {
  const rem = total % n;
  let av = total / n;
  if (minV > av || maxV < av) {
    throw new Errors(ErrorTypes.PARAMS_ERROR, '最大值不能小于平局数，最小值不能大于平均值');
  }
  av = Math.floor(av);
  const res = [];
  for (let index = 0; index < n; index += 1) {
    res.push(av);
  }
  res[0] += rem;
  for (let index = 0; index < res.length; index += 1) {
    const v: number = res[index];
    const randomIndex = Math.floor(Math.random() * res.length);
    const randomV: number = res[randomIndex];
    const sum = v + randomV;
    if (sum <= 11) {
      const v1 = Math.floor(Math.random() * sum) + 1;
      const v2 = sum - v1;
      if (v1 >= 1 && v2 >= 1 && randomIndex !== index) {
        res[index] = v1;
        res[randomIndex] = sum - v1;
      }
    } else {
      const v1 = random(1, sum);
      const v2 = sum - v1;
      if (v1 >= 1 && v2 >= 1 && randomIndex !== index) {
        res[index] = v1;
        res[randomIndex] = sum - v1;
      }
    }
  }
  return res;
}
export default {
  random,
  randomSplit,
};
