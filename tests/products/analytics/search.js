const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');
const mysql = require('../../../database');
const testData = require('../testData');

chai.use(chaiHttp);

describe('Products => Analytics => Search', () => {
  before(async () => {
    await testData.beforeSetUp();
    await testData.beforeLogin();
  });
  after(async () => {
    await testData.afterSetDown();
    await testData.afterLogin();
  });
  describe('GET /product/details', () => {
    it('should save an analytics object if a user is logged in', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(() => {
          agent
            .get('/products/search/productName')
            .then(() =>
              mysql.queryAsync('SELECT * FROM product_analytics WHERE user_id = 999999 AND activity = "SEARCH"'))
            .then(async (data) => {
              expect(data[0].user_id).to.equal(999999);
              expect(data[0].activity).to.equal('SEARCH');
              expect(JSON.parse(data[0].details)).to.be.an('object');
              expect(JSON.parse(data[0].details).QUERY).to.equal('productName');
              await mysql.queryAsync('DELETE FROM product_analytics WHERE id = ?', [data[0].id]);
              done();
            });
        });
    });
    it('should save an analytics object with page number if a user is logged in', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(() => {
          agent
            .get('/products/search/productName/2')
            .then(() =>
              mysql.queryAsync('SELECT * FROM product_analytics WHERE user_id = 999999 AND activity = "SEARCH"'))
            .then(async (data) => {
              expect(data[0].user_id).to.equal(999999);
              expect(data[0].activity).to.equal('SEARCH');
              expect(JSON.parse(data[0].details)).to.be.an('object');
              expect(JSON.parse(data[0].details).QUERY).to.equal('productName');
              expect(JSON.parse(data[0].details).PAGE).to.equal('2');
              await mysql.queryAsync('DELETE FROM product_analytics WHERE id = ?', [data[0].id]);
              done();
            });
        });
    });
  });
});
