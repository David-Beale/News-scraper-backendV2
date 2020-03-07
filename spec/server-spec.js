const got = require("got");
const mock = require("./mock-data");

const base_url = "http://localhost:4000/"
describe("Server testing", function () {
  describe("GET /", function () {
    it("returns status code 200", async function (done) {
      const response = await got(base_url + 'graphql?query={headline {headline}}')
      expect(response.statusCode).toBe(200)
      done();
    });
    it("returns correct query format", async function (done) {
      const response = await got(base_url + 'graphql?query={ headline(year: 0 month:0 day:0 _id: "5e6276a890c4e25154ae1750"){day month year newspaper headline}}')
      expect(JSON.parse(response.body)).toEqual(mock.query)
      done();
    });
  });
});