const { Op } = require('sequelize');
const _ = require('lodash');
const qs = require('qs');

exports.parseQuery = (queryString) => {
  const query = qs.parse(queryString);
  if (query.page || query.pageSize) {
    query.pageNum = Number(query.pageNum) || 1;
    query.pageSize = Number(query.pageSize) || 20;
  }
  return query;
};

exports.pagination2sql = ({ pageNum, pageSize }) => ({
  limit: pageSize,
  offset: pageSize * (pageNum - 1),
});

exports.sql2pagination = ({ pageNum, pageSize, count }) => ({
  total: count,
  pageNum,
  pageSize,
});

exports.filterSqlWhere = function filterWhere(where) {
  // eslint-disable-next-line max-len
  const newWhere = _.reduce([...Object.keys(where), ...Object.getOwnPropertySymbols(where)], (r, k) => {
    const nr = { ...r };
    if (_.isObject(where[k])) {
      nr[k] = filterWhere(where[k]);
      if ((_.keys(nr[k]).length === 0) && (Object.getOwnPropertySymbols(nr[k]).length === 0)) {
        delete nr[k];
      }
      return nr;
    }
    if ((k === Op.like) && (where[k] === '%%' || where[k] === '%')) {
      return nr;
    }
    nr[k] = where[k];
    return nr;
  }, {});
  return newWhere;
};
