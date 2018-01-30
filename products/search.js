const database = require('./database/search');
const format = require('./format');

const byString = async (string, page = 1) => {
  try {
    const dbResults = await database.byString(string, page);
    const totalItems = dbResults.hits.total;
    if (totalItems === 0) {
      return {
        statusCode: 404,
        message: 'No matching items found',
      };
    }

    const firstItemIndex = (page - 1) * 10 + 1;
    if (firstItemIndex > totalItems) {
      return {
        statusCode: 404,
        message: 'No matching items found',
      };
    }

    const results = dbResults.hits.hits.map(format.product);
    return {
      currentPage: page,
      totalPages: Math.ceil(totalItems / 10),
      firstItemIndex,
      lastItemIndex: firstItemIndex + results.length - 1,
      totalItems,
      results,
    };
  } catch (err) {
    return format.error(err);
  }
};

module.exports = {
  byString,
};
