const { expect } = require('chai');

const connection = require('../../database');
const reviews = require('../../products/reviews');
const testData = require('./testData');

describe('Products => Reviews', () => {
  before(testData.beforeMySQL);
  after(testData.afterMySQL);
  describe('reviews.getByProductId', () => {
    it('should return a list of reviews for a product given a valid product ID', () =>
      reviews.getByProductId('testProduct1').then((data) => {
        expect(data).to.have.lengthOf.at.least(3);
        expect(data[0].text).to.be.a('string');
        expect(data[0].user_id).to.be.a('number');
      })).timeout(1000);
    it('should return a list of reviews sorted by credibility and then date', () =>
      reviews.getByProductId('testProduct1').then((data) => {
        expect(data[0].credibility).to.equal(data[1].credibility);
        expect(data[0].created_at).to.be.greaterThan(data[1].created_at);
        expect(data[1].credibility).to.be.greaterThan(data[2].credibility);
      })).timeout(1000);
    it('should return a 404 if no reviews are found', () =>
      reviews
        .getByProductId('testProduct3')
        .then(data => expect(data.statusCode).to.equal(404))).timeout(1000);
  });
  describe('reviews.getByUserId', () => {
    it('should return a list of reivew from a user given a valid user ID', () =>
      reviews.getByUserId(999999).then(data => expect(data).to.have.lengthOf.at.least(5))).timeout(1000);
    it("should return a 404 if no reviews are found or if user doesn't exist", () =>
      reviews.getByUserId(99999999).then((data) => {
        expect(data.statusCode).to.equal(404);
        expect(data.message).to.equal('No reviews found');
      }));
  });
  describe('reviews.insert', () => {
    it('should insert a review into the database', async () => {
      await reviews.insert(9999999, 'testProduct3', 'testText', 1);
      const review = await connection
        .queryAsync('SELECT * FROM product_reviews WHERE user_id = 9999999')
        .then(data => data[0]);
      expect(review.user_id).to.equal(9999999);
      expect(review.product_id).to.equal('testProduct3');
      expect(review.text).to.equal('testText');
      expect(review.stars).to.equal(1);
      await connection.queryAsync('DELETE FROM product_reviews WHERE id = ?', [review.id]);
    });
  });
});
