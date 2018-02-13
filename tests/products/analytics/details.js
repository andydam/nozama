const { expect } = require('chai');
const chai = require('chai');
const chaiHttp = require('chai-http');

const server = require('../../../index');
const mysql = require('../../../database');
const testData = require('../testData');

chai.use(chaiHttp);

describe('Products => Analytics => Details', () => {
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
            .get('/products/details/test123Test')
            .then(() => mysql.queryAsync('SELECT * FROM product_analytics WHERE user_id = 999999'))
            .then(async (data) => {
              expect(data[0].user_id).to.equal(999999);
              expect(data[0].activity).to.equal('VIEW');
              expect(JSON.parse(data[0].details)).to.be.an('object');
              expect(JSON.parse(data[0].details).PRODUCT).to.equal('test123Test');
              await mysql.queryAsync('DELETE FROM product_analytics WHERE id = ?', [data[0].id]);
              done();
            });
        });
    });
  });
});
