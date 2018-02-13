const database = require('../database/analytics');

const insert = (userId, activity, details, time, duration) =>
  database.insert(
    userId,
    activity,
    details ? JSON.stringify(details) : null,
    new Date(time)
      .toISOString()
      .slice(0, 19)
      .replace('T', ' '),
    duration || null,
  );

module.exports = { insert };
