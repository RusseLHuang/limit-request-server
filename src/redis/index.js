const redis = require('redis');
const P = require('bluebird');

P.promisifyAll(redis);

const client = process.env.REDIS_URL ? 
  redis.createClient(process.env.REDIS_URL) : redis.createClient();

module.exports = client;