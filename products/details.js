const database = require('./database/details');
const format = require('./format');

const getById = async (id) => {
  try {
    const product = await database.getById(id);
    return format.product(product);
  } catch (err) {
    return format.error(err);
  }
};

module.exports = {
  getById,
};
