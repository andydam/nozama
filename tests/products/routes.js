const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../index');
const mysql = require('../../database');
const testData = require('./testData');

chai.use(chaiHttp);

describe('Products => Routes', () => {
  before(async () => {
    await testData.beforeSetUp();
    await testData.beforeMySQL();
    await testData.beforeLogin();
  });
  after(async () => {
    await testData.afterSetDown();
    await testData.afterMySQL();
    await testData.afterLogin();
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
    xit('should respond with a reasonable list of products given a matching query string', (done) => {
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
        .get('/products/search/productName/2')
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
  describe('GET /products/reviews', () => {
    it('should respond with JSON to a GET request', (done) => {
      chai
        .request(server)
        .get('/products/reviews/testProduct1')
        .end((err, res) => {
          expect(res).to.be.json;
          done();
        });
    });
    it('should respond with a list of reviews given a valid product ID', (done) => {
      chai
        .request(server)
        .get('/products/reviews/testProduct1')
        .end((err, res) => {
          expect(res.body).to.have.lengthOf.at.least(3);
          expect(res.body[0].text).to.be.a('string');
          expect(res.body[0].user_id).to.be.a('number');
          done();
        });
    });
    it('should repsond with a list of reviews sorted by credibility and then date', (done) => {
      chai
        .request(server)
        .get('/products/reviews/testProduct1')
        .end((err, res) => {
          expect(res.body[0].credibility).to.equal(res.body[1].credibility);
          expect(new Date(res.body[0].created_at)).to.be.greaterThan(new Date(res.body[1].created_at));
          expect(res.body[1].credibility).to.be.greaterThan(res.body[2].credibility);
          done();
        });
    });
    it('should respond with a 404 if no reviews are found', (done) => {
      chai
        .request(server)
        .get('/products/reviews/testProduct3')
        .end((err, res) => {
          expect(res.body.statusCode).to.equal(404);
          done();
        });
    });
    it('should respond with a list of reviews by a user when a user is logged in', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(() =>
          agent.get('/products/reviews').then((res) => {
            expect(res.body).to.have.lengthOf.at.least(5);
            done();
          }));
    }).timeout(1500);
    it('should allow a user to post a review', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(() =>
          agent
            .post('/products/reviews/testProduct3')
            .type('application/json')
            .send(JSON.stringify({ text: 'testText', stars: 5 }))
            .then(() =>
              mysql.queryAsync('SELECT * FROM product_reviews WHERE product_id = "testProduct3"'))
            .then(async (data) => {
              expect(data[0].user_id).to.equal(999999);
              expect(data[0].product_id).to.equal('testProduct3');
              expect(data[0].text).to.equal('testText');
              expect(data[0].stars).to.equal(5);
              await mysql.queryAsync('DELETE FROM product_reviews WHERE id = ?', [data[0].id]);
              done();
            }));
    }).timeout(1500);
    it('should respond with a 401 when posting a review if a user is not logged in', (done) => {
      chai
        .request(server)
        .post('/products/reviews/testProduct3')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
    it('should respond with a 401 to a GET request to /products/reviews/ if a user is not logged in', (done) => {
      chai
        .request(server)
        .get('/products/reviews')
        .end((err, res) => {
          expect(res.status).to.equal(401);
          done();
        });
    });
  });
});
