const { client } = require('./elasticsearch');

const getById = id => client.get({ index: 'nozama', type: 'products', id });

module.exports = { getById };
