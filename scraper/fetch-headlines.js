
const hashSum = require("hash-sum");
const Headlines = require("../server/models/headlines")

const helper = require('./helper-functions')

<<<<<<< HEAD
async function fetchHeadlines(date, data, test) {
  const [day, month, year, time] = date;
  const headlinesArray = Promise.all(data.map(async (newspaper) => {
    const html = await helper.getHeadline(newspaper.website, test)
    const image = newspaper.imageSelector && helper.parseImage(html, newspaper.imageSelector);
    const headline = helper.parseHeadline(html, newspaper.selector)

    const headlines = new Headlines({
      hash: hashSum(`${newspaper.name}${headline}`),
      day,
      month,
      year,
      time,
      newspaper: newspaper.name,
      headline: headline,
      locale: newspaper.country,
      website: newspaper.website,
      image: image
    })
    return headlines;
=======
async function fetchHeadlines (date, data, test) {
  const [day, month, year, time] = date;
  const headlinesArray = Promise.all(data.map(async (newspaper) => {
    const html = await helper.getHeadline(newspaper.website, test)
    const { headline, summary, link, image } = helper.parseHeadline(html, newspaper.selector, newspaper.titlePath, newspaper.titleRoot, newspaper.summaryPath, newspaper.linkPath, newspaper.imagePath, newspaper.website, newspaper.imageTag)
    if (headline) {
      const headlines = new Headlines({
        hash: hashSum(`${newspaper.name}${headline}`),
        day,
        month,
        year,
        time,
        newspaper: newspaper.name,
        headline,
        summary,
        link,
        image,
        locale: newspaper.country,
        scraperID: newspaper._id.toString(),
      })
      return headlines;
    }
>>>>>>> 60dbf185e85535c3b9883aadb92b87b9319a698f
  }))
  return headlinesArray;
}

module.exports = fetchHeadlines;





