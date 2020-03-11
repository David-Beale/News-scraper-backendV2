const BASE_URL = 'http://localhost:4000'

export default {
  getHeadlines: (day, month, year, locale) => {
    return fetchRequest(`graphql?query={ headline(year: ${year} month:${month} day:${day} locale: "${locale ? locale : "UK"}" )
      {day 
      month 
      year 
      newspaper 
      id
      headline
      summary
      image
      link 
      scraperID}
    }`);
  },
  getWebsite: (website) => {
    return fetchRequest(`graphql?query={  html(name:"${website}"){
      htmlBody
      website
      name
      country
    }
  }`);
  },
  forceRefresh: () => {
    return fetchRequest(`graphql?query={  refresh( name:"refresh")
  }`);
  },
  saveNewFeed: (webLink, webName, webCountry, titlePath, root, summaryPath, linkPath, imagePath, imageTag) => {
    titlePath = JSON.stringify(titlePath)
    summaryPath = JSON.stringify(summaryPath)
    linkPath = JSON.stringify(linkPath)
    imagePath = JSON.stringify(imagePath)
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { query: `mutation add { addFeed(website: "${webLink}" name: "${webName}" titlePath: ${titlePath} titleRoot: "${root}" summaryPath: ${summaryPath} linkPath: ${linkPath} imagePath: ${imagePath} country:"${webCountry}" imageTag:"${imageTag}") { website } }` })
    }
    console.log(options.body)
    return fetchRequest(``, options);
  },
  deleteHeadline: (id) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { query: `mutation deleteHeadline { deleteHeadline(id: "${id}") }` })
    }
    return fetchRequest(``, options);
  },
  deleteScraper: (id) => {
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        { query: `mutation deleteScraper { deleteScraper(id: "${id}") }` })
    }
    return fetchRequest(``, options);
  },
};

const fetchRequest = (url, options) => {
  return fetch(`${BASE_URL}/${url}`, options)
    .then(res => res.status <= 400 ? res : Promise.reject(res))
    .then(res => {
      return res.json()
    })
    .catch((err) => {
      console.log(`${err.message} while fetching /${url}`)
    });
};