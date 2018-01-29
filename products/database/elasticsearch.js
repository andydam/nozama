const elasticSearch = require('elasticsearch');

const client = new elasticSearch.Client({
  hosts: process.env.ELASTICSEARCH_DB || '127.0.0.1:9200',
});

module.exports = {
  client,
};
