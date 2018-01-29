const { expect } = require('chai');
const chai = require('chai');
const elasticSearch = require('elasticsearch');

const { client } = require('../../../products/database/elasticsearch');

describe('Products => Database => Elasticsearch', () => {
  before(async () => {
    try {
      const nozamaIndex = await client.indices.get({ index: 'nozama' });
    } catch (err) {
      if (err.status === 404) {
        await client.indices.create({ index: 'nozama' });
        await client.index({
          index: 'nozama',
          id: 'test123Test',
          type: 'products',
          body: {
            name: 'productName',
            description: 'productDescription',
            catgeories: ['productCategory'],
            brand: 'productBrand',
            price: 1.99,
          },
        });
        await client.indices.refresh();
      }
    }
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
});
