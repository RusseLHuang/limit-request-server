const app = require('../src');
const { expect } = require('chai');
const request = require('supertest');
const Promise = require('bluebird');

describe("Request limit rate", () => {
  const sleep = (ms) => new Promise(resolve => { setTimeout(resolve, ms) });

  it("Limit for 1 minutes", async () => {
    const user1IP = "198.168.1.123";
    const user2IP = "198.168.1.124";
    const indexes = new Array(60);

    await request(app).put('/refresh')
      .set('X-Forwarded-For', user1IP);

    await Promise.each(indexes, async (item, i) => {
      const expectedIndex = i + 1;
      const res = await request(app).get('/')
        .set('X-Forwarded-For', user1IP);

      expect(res.text).equal(expectedIndex.toString(10));
    });

    let res1 = await request(app).get('/')
      .set('X-Forwarded-For', user1IP);
    let res2 = await request(app).get('/')
      .set('X-Forwarded-For', user2IP);

    expect(res1.text).equal("Error");
    expect(res2.text).equal("1");

    await sleep(60000);

    res1 = await request(app).get('/')
      .set('X-Forwarded-For', user1IP);
    expect(res1.text).equal("1");
  });
});