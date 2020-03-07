// const BASE_URL = 'https://cw-events-092017.herokuapp.com'
const BASE_URL = 'http://localhost:4000'

export default {
  getHeadlines: () => {
    return fetchRequest(`graphql?query={ headline(year: 2020 month:3 day:5 locale: "UK" )
      {day 
      month 
      year 
      newspaper 
      id
      headline }
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