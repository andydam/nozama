const { expect } = require('chai');

const details = require('../../products/details');
const testData = require('./testData');

describe('Products => Details', () => {
  before(testData.beforeSetUp);
  after(testData.afterSetDown);
  describe('details.getById', () => {
    it('should return product details given a valid product ID', async () => {
      const product = await details.getById('test123Test');
      expect(product).to.be.an('object');
      expect(product.id).to.equal('test123Test');
      expect(product.name).to.equal('productName');
      expect(product.description).to.equal('productDescription');
      expect(product.categories).to.be.an('array');
      expect(product.price).to.equal(1.99);
      expect(product.brand).to.equal('productBrand');
    });
    it('should return a 404 given an invalid product ID', async () => {
      try {
        await details.getById('test123Test123');
      } catch (err) {
        expect(err.statusCode).to.equal(404);
        expect(err.message).to.equal('Not Found');
      }
    });
  });
});
