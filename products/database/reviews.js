const connection = require('../../database');

const getByProductId = productId =>
  connection.queryAsync(
    'SELECT text, user_id, created_at, stars, credibility, is_customer FROM product_reviews WHERE product_id = ?',
    [productId],
  );

const getByUserId = userId =>
  connection.queryAsync(
    'SELECT text, created_at, stars, credibility, is_customer, product_id FROM product_reviews WHERE user_id = ?',
    [userId],
  );

const insert = (userId, productId, text, createdAt, stars, isCustomer, isProfessional) =>
  connection
    .queryAsync(
      'INSERT INTO product_reviews (user_id, product_id, text, created_at, stars, is_customer, is_professional) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [userId, productId, text, createdAt, stars, isCustomer, isProfessional],
    )
    .then(results => results.insertId);

module.exports = { getByProductId, getByUserId, insert };
