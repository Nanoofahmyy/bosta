const chai = require('chai');
const expect = chai.expect;

describe("HELLO test", () => {
  it("HELLO test", async () => {
    try {
      let body = { test: "hello test" };
      expect(body).to.have.own.property("test");
      expect(body.test).to.equal("hello test");
    } catch (error) {
      throw error;
    }
  });
});