const { insert } = require('./insert');

const view = (userId, productId, time) =>
  insert(userId, 'VIEW', { PRODUCT: productId }, time, 10000);

module.exports = {
  view,
};
