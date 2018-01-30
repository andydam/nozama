const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const testData = require('./testData');

chai.use(chaiHttp);

describe('Products => Routes', () => {
  before(testData.beforeSetUp);
  after(testData.afterSetDown);
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
  describe('GET /products/search', () => {
    it('should respond with JSON to a GET request with a search query', (done) => {
      chai
        .request(server)
        .get('/products/search/test123Test')
        .end((err, res) => {
          expect(res).to.be.json;
          done();
        });
    });
    it('should respond with a list of products given a matching query string', (done) => {
      chai
        .request(server)
        .get('/products/search/productName')
        .end((err, res) => {
          expect(res.body).to.be.an('object');
          expect(res.body.totalItems).to.be.at.least(1);
          expect(res.body.results).to.be.an('array');
          done();
        });
    });
    it('should respond with a reasonable list of products given a matching query string', (done) => {
      chai
        .request(server)
        .get('/products/search/productName')
        .end((err, res) => {
          expect(res.body.results).to.have.lengthOf.at.least(1);
          expect(res.body.results[0]).to.be.an('object');
          expect(res.body.results[0].id).to.equal('test123Test');
          expect(res.body.results[0].name).to.equal('productName');
          expect(res.body.results[0].description).to.equal('productDescription');
          expect(res.body.results[0].categories).to.be.an('array');
          expect(res.body.results[0].price).to.equal(1.99);
          expect(res.body.results[0].brand).to.equal('productBrand');
          done();
        });
    });
    it('should respond with results split up into pages of ten each', (done) => {
      chai
        .request(server)
        .get('/products/search/productName')
        .end((err, res) => {
          expect(res.body.currentPage).to.equal(1);
          expect(res.body.lastItemIndex).to.be.at.most(10);
          expect(res.body.results).to.have.lengthOf.at.most(10);
          done();
        });
    });
    it('should respond with other pages when requested', (done) => {
      chai
        .request(server)
        .get('/products/search/productName')
        .end((err, res) => {
          expect(res.body.currentPage).to.equal(2);
          expect(res.body.firstItemIndex).to.be.at.least(11);
          expect(res.body.lastItemIndex).to.be.at.most(20);
          expect(res.body.results).to.have.lengthOf.at.most(10);
          done();
        });
    });
    it('should respond with a 404 if no matching products are found', (done) => {
      chai
        .request(server)
        .get('/products/search/asdfproductName')
        .end((err, res) => {
          expect(res.body.statusCode).to.equal(404);
          expect(res.body.message).to.equal('No matching items found');
          done();
        });
    });
    it('should respond with a 404 to a GET request without a search query', (done) => {
      chai
        .request(server)
        .get('/products/search')
        .end((err, res) => {
          expect(res.status).to.equal(404);
          done();
        });
    });
  });
});
