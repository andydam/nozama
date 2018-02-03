const { insert } = require('./insert');

const query = (userId, textQuery, time) => insert(userId, 'SEARCH', { QUERY: textQuery }, time);

const queryPage = (userId, textQuery, page, time) =>
  insert(userId, 'SEARCH', { QUERY: textQuery, PAGE: page }, time);

module.exports = {
  query,
  queryPage,
};
