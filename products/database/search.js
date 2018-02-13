const { client } = require('./elasticsearch');

const byString = (string, page) =>
  client.search({
    index: process.env.ELASTIC_INDEX,
    type: 'products',
    body: {
      query: {
        bool: {
          should: [{ match: { name: { query: string, boost: 7 } } }],
          // should: [
          //   { match: { description: { query: string, boost: 5 } } },
          //   {
          //     bool: {
          //       should: [
          //         { match: { brand: { query: string, boost: 4 } } },
          //         { match: { categories: { query: string, boost: 3 } } },
          //       ],
          //     },
          //   },
          // ],
        },
      },
    },
    size: 10,
    from: (page - 1) * 10,
  });

module.exports = {
  byString,
};
