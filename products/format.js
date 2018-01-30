const product = product => ({
  id: product._id,
  name: product._source.name,
  brand: product._source.brand,
  price: product._source.price,
  description: product._source.description,
  categories: product._source.categories,
});

const error = error => ({
  message: error.message,
  statusCode: error.status,
});

module.exports = { product };
