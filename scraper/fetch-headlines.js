
const hashSum = require("hash-sum");
const Headlines = require("../server/models/headlines")

const helper = require('./helper-functions')

async function fetchHeadlines (date, data, test) {
  const [day,month,year,time] = date;
  const headlinesArray = Promise.all( data.map( async (newspaper) => {
    const html = await helper.getHeadline(newspaper.website, test)
    const headline = helper.parseHeadline(html, newspaper.selector, newspaper.titlePath, newspaper.titleRoot,newspaper.summaryPath,newspaper.linkPath,newspaper.imagePath, newspaper.website)
    const headlines = new Headlines ({
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





