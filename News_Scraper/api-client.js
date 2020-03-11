const BASE_URL = 'http://localhost:4000'

export default {
  getHeadlines: () => {
    return fetchRequest(`graphql?query={ headline(year: 2020 month:3 day:11 locale: "UK" )
      {day 
      month 
      year 
      newspaper 
      id
      headline }
    }`);
  },
  getWebsite: (httpAddress) => {
    return fetchRequest(`graphql?query={  html(name:"${httpAddress}"){
      htmlBody
    }
  }`);
  },
  saveNewFeed: (webLink, webName, webCountry,titlePath, root, summaryPath, linkPath, imagePath, imageTag) => {
    titlePath = JSON.stringify(titlePath)
    summaryPath = JSON.stringify(summaryPath)
    linkPath = JSON.stringify(linkPath)
    imagePath = JSON.stringify(imagePath)
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(
        {query: `mutation add { addFeed(website: "${webLink}" name: "${webName}" titlePath: ${titlePath} titleRoot: "${root}" summaryPath: ${summaryPath} linkPath: ${linkPath} imagePath: ${imagePath} country:"${webCountry}" imageTag:"${imageTag}") { website } }`})
      }
      console.log(options.body)
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