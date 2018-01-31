const database = require('./database/reviews');
const format = require('./format');

const getByProductId = async (productId) => {
  try {
    const reviews = await database.getByProductId(productId);
    if (reviews.length === 0) {
      return {
        statusCode: 404,
        message: 'No reviews found',
      };
    }
    reviews.sort((a, b) => {
      if (a.credibility > b.credibility) {
        return -1;
      }
      if (a.credibility < b.credibility) {
        return 1;
      }
      const aDate = new Date(a.created_at);
      const bDate = new Date(b.created_at);
      if (aDate > bDate) {
        return -1;
      }
      if (aDate < bDate) {
        return 1;
      }
      return 0;
    });
    return reviews;
  } catch (err) {
    return format.error(err);
  }
};

const getByUserId = async (userId) => {
  try {
    const reviews = await database.getByUserId(userId);
    if (reviews.length === 0) {
      return {
        statusCode: 404,
        message: 'No reviews found',
      };
    }
    return reviews;
  } catch (err) {
    return format.error(err);
  }
};

const insert = async (userId, productId, text, stars, isCustomer = 1, isProfessional = 0) => {
  try {
    const createdAt = new Date().toISOString().slice(0, 10);
    return await database.insert(
      userId,
      productId,
      text,
      createdAt,
      stars,
      isCustomer,
      isProfessional,
    );
  } catch (err) {
    return format.error(err);
  }
};

module.exports = {
  getByProductId,
  getByUserId,
  insert,
};
