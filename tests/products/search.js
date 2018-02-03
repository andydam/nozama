const { expect } = require('chai');

const search = require('../../products/search');
const testData = require('./testData');

describe('Products => Search', () => {
  before(testData.beforeSetUp);
  after(testData.afterSetDown);
  describe('search.byString', () => {
    it('should return a list of products given a matching query string', async () => {
      const results = await search.byString('productName', 1);
      expect(results).to.be.an('object');
      expect(results.totalItems).to.be.at.least(1);
      expect(results.results).to.be.an('array');
    }).timeout(1000);
    it('should return a reasonable list of products given a matching query string', async () => {
      const results = await search.byString('productName', 1);
      expect(results.results).to.have.lengthOf.at.least(1);
      expect(results.results[0]).to.be.an('object');
      expect(results.results[0].id).to.equal('test123Test');
      expect(results.results[0].name).to.equal('productName');
      expect(results.results[0].description).to.equal('productDescription');
      expect(results.results[0].categories).to.be.an('array');
      expect(results.results[0].price).to.equal(1.99);
      expect(results.results[0].brand).to.equal('productBrand');
    }).timeout(1000);
    it('should split up results into pages of ten each', async () => {
      const results = await search.byString('productName', 1);
      expect(results.currentPage).to.equal(1);
      expect(results.lastItemIndex).to.be.at.most(10);
      expect(results.results).to.have.lengthOf.at.most(10);
    }).timeout(1000);
    it('should display other pages', async () => {
      const results = await search.byString('productName', 2);
      expect(results.currentPage).to.equal(2);
      expect(results.firstItemIndex).to.be.at.least(11);
      expect(results.lastItemIndex).to.be.at.most(20);
      expect(results.results).to.have.lengthOf.at.most(10);
    }).timeout(1000);
    it('should return a 404 if no matching products are found', async () => {
      const results = await search.byString('asdfproductName', 1);
      expect(results.statusCode).to.equal(404);
      expect(results.message).to.equal('No matching items found');
    }).timeout(1000);
    it('should return a 404 given an invalid page', async () => {
      const results = await search.byString('productName', 20);
      expect(results.statusCode).to.equal(404);
      expect(results.message).to.equal('No matching items found');
    }).timeout(1000);
  });
});
