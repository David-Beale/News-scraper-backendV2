const got = require('got');
const cheerio = require('cheerio');

module.exports = {
  getHeadline: async function (link) {
    try {
      const response = await got(link);
      const data = response.body;
      return data
    } catch (error) {
      console.log(error.response.body);
    }
  },
  parseHeadline: function (data, selector) {
    const $ = cheerio.load(`${data}`);
    const headline = $(selector).first().text().trim();
    return headline;
  }
}

