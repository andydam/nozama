const { client } = require('./elasticsearch');

const byString = string =>
  client.search({
    index: 'nozama',
    type: 'products',
    q: string,
  });

module.exports = {
  byString,
};
