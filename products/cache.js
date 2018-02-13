const redis = require('redis');
const util = require('util');

const client = redis.createClient(process.env.REDIS_URL || 'redis://127.0.0.1:6379');
client.on('error', console.error);

client.getAsync = util.promisify(client.get);
client.setAsync = util.promisify(client.set);

const memoize = async (func, ...args) => {
  const key = func.name + JSON.stringify(args);

  const value = await client.getAsync(key);

  if (value === null) {
    const output = await func(...args);

    const redisObj = {
      data: output,
      createdAt: new Date().getTime(),
    };

    client
      .setAsync(key, JSON.stringify(redisObj), 'EX', 1800)
      .catch(err => console.log('error saving to cache, ', err));

    return output;
  }

  return JSON.parse(value).data;
};

module.exports = { memoize };
