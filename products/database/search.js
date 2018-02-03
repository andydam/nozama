const { client } = require('./elasticsearch');

const byString = (string, page) =>
  client.search({
    index: process.env.ELASTIC_INDEX,
    type: 'products',
    q: string,
    from: (page - 1) * 10,
  });

module.exports = {
  byString,
};
