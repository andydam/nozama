const { expect } = require('chai');

const { client } = require('../../products/database/elasticsearch');
const details = require('../../products/details');

describe('Products => Details', () => {
  before(async () => {
    try {
      await client.indices.get({ index: 'nozama' });
    } catch (err) {
      if (err.status === 404) {
        await client.indices.create({ index: 'nozama' });
        await client.indices.refresh();
      }
    }
    try {
      await client.get({
        index: 'nozama',
        type: 'products',
        id: 'test123Test',
      });
    } catch (err) {
      if (err.status === 404) {
        await client.index({
          index: 'nozama',
          id: 'test123Test',
          type: 'products',
          body: {
            name: 'productName',
            description: 'productDescription',
            categories: ['productCategory'],
            brand: 'productBrand',
            price: 1.99,
          },
        });
        await client.indices.refresh();
      }
    }
  });
  after(async () => {
    await client.delete({
      index: 'nozama',
      type: 'products',
      id: 'test123Test',
    });
  });
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
