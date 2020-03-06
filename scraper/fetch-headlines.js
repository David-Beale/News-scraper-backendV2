const moment = require('moment');
const hashSum = require("hash-sum");
const Headlines = require("../server/models/headlines")
const data = require('./data')
const helper = require('./html-parser')

//ADD NEWSPAPERS HERE
async function fetchHeadlines () {
  const day = Number(moment(Date.now()).format("DD"));
  const month = Number(moment(Date.now()).format("MM"));
  const year = Number(moment(Date.now()).format("YYYY"));
  const time = moment(Date.now()).format("LT");
  const headlinesArray = Promise.all( data.map( async (newspaper) => {
    const html = await helper.getHeadline(newspaper.website)
    const headline = await helper.parseHeadline(html, newspaper.selector)
    const headlines = await new Headlines ({
      hash:  hashSum(`${newspaper.name}${headline}`),
      day,
      month,
      year,
      time,
      newspaper: newspaper.name,
      headline: headline,
      locale: newspaper.country,
    })
    return headlines;
  }))
  return headlinesArray;
}

module.exports = fetchHeadlines;





