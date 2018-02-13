const { client } = require('./elasticsearch');

const getById = id => client.get({ index: process.env.ELASTIC_INDEX, type: 'products', id });

module.exports = { getById };
