const { client } = require('./elasticsearch');

const byString = (string, page) =>
  client.search({
    index: 'nozama',
    type: 'products',
    q: string,
    from: (page - 1) * 10,
  });

module.exports = {
  byString,
};
