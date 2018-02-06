const { expect } = require('chai');

const format = require('../../products/format');

describe('Products => Formatter', () => {
  describe('format.product', () => {
    it('should properly format product data', () => {
      const product = {
        _id: 'test123Test',
        _source: {
          name: 'productName',
          description: 'productDescription',
          categories: ['productCategory'],
          brand: 'productBrand',
          price: 1.99,
        },
      };
      const formattedProduct = format.product(product);
      expect(formattedProduct).to.be.an('object');
      expect(formattedProduct.id).to.equal('test123Test');
      expect(formattedProduct.name).to.equal('productName');
      expect(formattedProduct.description).to.equal('productDescription');
      expect(formattedProduct.categories).to.be.an('array');
      expect(formattedProduct.price).to.equal(1.99);
      expect(formattedProduct.brand).to.equal('productBrand');
    }).timeout(1000);
  });
  describe('format.error', () => {
    it('should properly format errors', () => {
      const error = {
        message: 'Error message',
        status: 404,
      };
      const formattedError = format.error(error);
      expect(formattedError).to.be.an('object');
      expect(formattedError.message).to.equal('Error message');
      expect(formattedError.statusCode).to.equal(404);
    });
  });
});
