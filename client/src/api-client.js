// const BASE_URL = 'https://cw-events-092017.herokuapp.com'
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
      image
      website }
    }`);
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