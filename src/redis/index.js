const redis = require('redis');
const P = require('bluebird');

P.promisifyAll(redis);

const client = redis.createClient();

module.exports = client;