const { expect } = require('chai');
const redis = require('redis');
const util = require('util');

const client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
client.getAsync = util.promisify(client.get);

const cache = require('../../products/cache');

describe('Products => Cache', () => {
  describe('cache.memoize', () => {
    it("should store a function's output in Redis", async () => {
      const testFunction = input => `1${input}`;
      await cache.memoize(testFunction, 'test');
      expect(JSON.parse(await client.getAsync('testFunction["test"]')).data).to.equal('1test');
    });
    it("should get a function's output from Redis if cached", async () => {
      const testFunction = input => `2${input}`;
      expect(await cache.memoize(testFunction, 'test')).to.equal('1test');
    });
  });
});
