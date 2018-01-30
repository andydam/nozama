const database = require('../database/details');

const getById = async (id) => {
  try {
    const product = await database.getById(id);
    return {
      id: product._id,
      name: product._source.name,
      brand: product._source.brand,
      price: product._source.price,
      description: product._source.description,
      categories: product._source.categories,
    };
  } catch (err) {
    return {
      message: err.message,
      statusCode: err.status,
    };
  }
};

module.exports = {
  getById,
};
