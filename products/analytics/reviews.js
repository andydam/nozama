const { insert } = require('./insert');

const post = (userId, productId, time) => insert(userId, 'REVIEW', { PRODUCT: productId }, time);

module.exports = { post };
