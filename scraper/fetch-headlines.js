
const hashSum = require("hash-sum");
const Headlines = require("../server/models/headlines")

const helper = require('./helper-functions')

async function fetchHeadlines(date, data, test) {
  const [day, month, year, time] = date;
  const headlinesArray = Promise.all(data.map(async (newspaper) => {
    const html = await helper.getHeadline(newspaper.website, test)
    const { headline, summary, link, image } = helper.parseHeadline(html, newspaper.titlePath, newspaper.titleRoot, newspaper.summaryPath, newspaper.linkPath, newspaper.imagePath, newspaper.website, newspaper.imageTag)
    if (headline) {
      const headlines = new Headlines({
        hash: hashSum(`${newspaper.name}${headline}${newspaper.email}`),
        day,
        month,
        year,
        time,
        newspaper: newspaper.name,
        headline,
        summary,
        link,
        image,
        email: newspaper.email,
        scraperID: newspaper._id.toString(),
      })
      return headlines;
    }
  }))
  return headlinesArray;
}

module.exports = fetchHeadlines;





