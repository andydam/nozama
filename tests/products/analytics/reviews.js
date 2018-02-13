const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');
const mysql = require('../../../database');
const testData = require('../testData');

chai.use(chaiHttp);

describe('Products => Analytics => Reviews', () => {
  before(testData.beforeLogin);
  after(testData.afterLogin);
  describe('POST /product/reviews', () => {
    it('should save an analytics object if user posts a review', (done) => {
      const agent = chai.request.agent(server);
      agent
        .post('/auth')
        .type('application/json')
        .send(JSON.stringify({ username: 'testUser123', password: 'asdf' }))
        .then(() => {
          agent
            .post('/products/reviews/testProduct3')
            .type('application/json')
            .send(JSON.stringify({ text: 'testText', stars: 5 }))
            .then(() =>
              mysql.queryAsync('SELECT * FROM product_analytics WHERE user_id = 999999 AND activity = "REVIEW"'))
            .then(async (data) => {
              expect(data[0].user_id).to.equal(999999);
              expect(data[0].activity).to.equal('REVIEW');
              expect(JSON.parse(data[0].details)).to.be.an('object');
              expect(JSON.parse(data[0].details).PRODUCT).to.equal('testProduct3');
              await mysql.queryAsync('DELETE FROM product_reviews WHERE product_id = "testProduct3"');
              done();
            });
        });
    });
  });
});
