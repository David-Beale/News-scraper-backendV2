const got = require('got');
const cheerio = require('cheerio');
const fs = require('fs');


async function getHeadline() {
  
  try {
    const response = await got('https://www.bbc.com/');
    const data = await response.body;
    const $ = cheerio.load(`${data}`);
    
    // fs.writeFileSync('./bbc.json', data, 'utf8')
    //DATA-START
    const headline = $('li.media-list__item--1 a.media__link').first().text();
    // DATA-END

    return ['BBC news', headline.trim(), 'UK'];
  } catch (error) {
    console.log(error.response.body);
  }
};

exports.getHeadline = getHeadline;