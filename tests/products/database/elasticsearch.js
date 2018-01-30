const { expect } = require('chai');

const { client } = require('../../../products/database/elasticsearch');
const details = require('../../../products/database/details');

describe('Products => Database => Elasticsearch', () => {
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
  describe('client', () => {
    it('should connect to the Elasticsearch DB server', async () => {
      const health = await client.cluster.health();
      expect(health.cluster_name).to.be.a('string');
      expect(health.number_of_nodes).to.be.at.least(1);
      expect(health.number_of_data_nodes).to.be.at.least(1);
    }).timeout(1000);
    it('should have access to the nozama index', async () => {
      const resp = await client.indices.get({ index: 'nozama' });
      expect(resp).to.be.an('object');
      expect(resp).to.have.property('nozama');
    }).timeout(1000);
    it('should have access to the products type', async () => {
      const resp = await client.indices.existsType({ index: 'nozama', type: 'products' });
      expect(resp).to.equal(true);
    }).timeout(1000);
  });
  describe('details.getById', () => {
    it('should return a correct product given a valid id', async () => {
      const product = await details.getById('test123Test');
      expect(product).to.be.an('object');
      expect(product.found).to.equal(true);
      expect(product._id).to.equal('test123Test');
      expect(product._source.name).to.equal('productName');
      expect(product._source.description).to.equal('productDescription');
      expect(product._source.categories).to.be.an('array');
      expect(product._source.price).to.equal(1.99);
      expect(product._source.brand).to.equal('productBrand');
    }).timeout(1000);
    it('should return an error given an invalid id', async () => {
      try {
        await details.getById('test123Test123');
      } catch (err) {
        expect(err.status).to.equal(404);
      }
    }).timeout(1000);
  });
});
