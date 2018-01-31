const { expect } = require('chai');

const connection = require('../../../database');
const reviews = require('../../../products/database/reviews');
const testData = require('../testData');

describe('Products => Database => MySQL', () => {
  before(testData.beforeMySQL);
  after(testData.afterMySQL);
  describe('reviews.getByProductID', () => {
    it('should return reviews for a product given a valid product ID', () =>
      reviews.getByProductId('testProduct1').then((data) => {
        expect(data).to.have.lengthOf.at.least(3);
        expect(data[0].text).to.equal('sampleText1');
        expect(data[0].user_id).to.equal(999999);
      })).timeout(1000);
    it('should return nothing given a product ID without reviews', () =>
      reviews
        .getByProductId('testProduct3')
        .then(data => expect(data).to.have.lengthOf.at.most(0))).timeout(1000);
  });
  describe('reviews.getByUserId', () => {
    it('should return reviews by a user given a valid user ID', () =>
      reviews.getByUserId(999999).then((data) => {
        expect(data).to.have.lengthOf.at.least(3);
        expect(data[0].text).to.equal('sampleText1');
        expect(data[0].product_id).to.equal('testProduct1');
      })).timeout(1000);
    it('should return nothing given an invalid user ID or user ID without reviews', () =>
      reviews
        .getByUserId(999999999)
        .then(data => expect(data).to.have.lengthOf.at.most(0))).timeout(1000);
  });
  describe('reviews.insert', () => {
    it('should insert a review into the database', async () => {
      const reviewId = await reviews.insert(
        999999,
        'testProduct3',
        'testText',
        '2001-01-01',
        5,
        1,
        0,
      );
      const review = await connection
        .queryAsync('SELECT * FROM product_reviews WHERE id = ?', [reviewId])
        .then(data => data[0]);
      expect(review).to.be.an('object');
      expect(review.text).to.equal('testText');
      expect(review.user_id).to.equal(999999);
      expect(review.product_id).to.equal('testProduct3');
      expect(review.stars).to.equal(5);
      expect(review.is_customer).to.equal(1);
      expect(review.is_professional).to.equal(0);
      await connection.queryAsync('DELETE FROM product_reviews WHERE id = ?', [reviewId]);
    }).timeout(1500);
  });
});
