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
      const response = await got(base_url + 'graphql?query={ headline(year: 2020 month:3 day:5){day month year newspaper headline}}')
      expect(JSON.parse(response.body)).toEqual(mock.query)
      done();
    });
  });
});