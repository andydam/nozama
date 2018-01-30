const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const { client } = require('../../products/database/elasticsearch');
const server = require('../../index');

chai.use(chaiHttp);

describe('Products => Routes', () => {
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
  describe('GET /products/details', () => {
    it('should respond with JSON to a GET request', (done) => {
      chai
        .request(server)
        .get('/products/details/test123Test')
        .end((err, res) => {
          expect(res).to.be.json;
          done();
        });
    }).timeout(1000);
    it('should respond with product details given a valid product ID', (done) => {
      chai
        .request(server)
        .get('/products/details/test123Test')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body).to.be.an('object');
          expect(res.body.id).to.equal('test123Test');
          expect(res.body.name).to.equal('productName');
          expect(res.body.description).to.equal('productDescription');
          expect(res.body.categories).to.be.an('array');
          expect(res.body.price).to.equal(1.99);
          expect(res.body.brand).to.equal('productBrand');
          done();
        });
    }).timeout(1000);
    it('should respond with a 404 given an invalid product ID', (done) => {
      chai
        .request(server)
        .get('/products/details/test123Test123')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.body.statusCode).to.equal(404);
          expect(res.body.message).to.equal('Not Found');
          done();
        });
    });
  });
});
