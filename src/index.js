const express = require('express');
const requestIp = require('request-ip');
const redisClient = require('./redis');
const app = express();

const PORT = process.env.PORT || 3737;
const limitRequestPerMin = 60;
const limitTime = 60; // 1 minute
const time = ':time';
const count = ':count';

app.use(requestIp.mw());

if (process.env.NODE_ENV == "dev") {
  app.enable('trust proxy');
}

app.get('/', async (req, res) => {
  const clientIp = req.clientIp;
  const now = new Date().getTime();
  const requestTime = await redisClient.getAsync(`${clientIp}${time}`);
  const refreshTime = !requestTime ? 0 : parseInt(requestTime) + (limitTime * 1000);

  if (!requestTime || refreshTime < now) {
    updateReqCount = redisClient.setAsync(`${clientIp}${count}`, 1, 'EX', limitTime);
    updateReqTime = redisClient.setAsync(`${clientIp}${time}`, now, 'EX', limitTime);
    await Promise.all([updateReqCount, updateReqTime]);

    return res.send("1");
  }

  const requestCount = await redisClient.incrAsync(`${clientIp}${count}`);

  if (requestCount > limitRequestPerMin) {
    return res.send("Error");
  }

  return res.send(requestCount.toString(10));
})

app.put('/refresh', async (req, res) => {
  const clientIp = req.clientIp;

  await redisClient.del(`${clientIp}${count}`);
  await redisClient.del(`${clientIp}${time}`);

  return res.send("OK");
})

app.listen(PORT, async () => {
  console.log(`Listening at port : ${PORT}`);
})

module.exports = app;