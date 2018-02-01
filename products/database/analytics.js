const connection = require('../../database');

const insert = (userId, activity, details, time, duration) =>
  connection
    .queryAsync(
      'INSERT INTO product_analytics (user_id, activity, details, time, duration) VALUES (?, ?, ?, ?, ?)',
      [userId, activity, details, time, duration],
    )
    .then(results => results.insertId);

module.exports = { insert };
