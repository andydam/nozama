const database = require('./database/search');
const format = require('./format');

const byString = async (string) => {
  try {
    const dbResults = await database.byString(string);
    const totalItems = dbResults.hits.total;
    if (totalItems === 0) {
      return {
        statusCode: 404,
        message: 'No matching items found',
      };
    }

    const results = dbResults.hits.hits.map(format.product);
    return {
      results,
    };
  } catch (err) {
    return format.error(err);
  }
};

module.exports = {
  byString,
};
