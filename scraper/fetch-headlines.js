const moment = require('moment');
const hashSum = require("hash-sum");
const Headlines = require("../server/models/headlines")

const getBBCnews = require('./newspapers/UK/bbc-news').getHeadline;
const getDailyMail = require('./newspapers/UK/daily-mail').getHeadline;
const getEveningStandard = require('./newspapers/UK/evening-standard').getHeadline;
const getTheGuardian = require('./newspapers/UK/the-guardian').getHeadline;
const getMorningStar = require('./newspapers/UK/morning-star').getHeadline;
const getLaVanguardia = require('./newspapers/spain/la-vanguardia').getHeadline;
const getElPais = require('./newspapers/spain/el-pais').getHeadline;
const getElMundo = require('./newspapers/spain/el-mundo').getHeadline;
const getVeinteMinutos = require('./newspapers/spain/20-minutos').getHeadline;
const getElPeriodico = require('./newspapers/spain/el-periodico').getHeadline;
const getElConfidencial = require('./newspapers/spain/el-confidencial').getHeadline;
const getExpansion = require('./newspapers/spain/expansion').getHeadline;
const getElMundoToday = require('./newspapers/spain/el-mundo-today').getHeadline;

//ADD NEWSPAPERS HERE

async function fetchHeadlines () {
  const day = Number(moment(Date.now()).format("DD"));
  const month = Number(moment(Date.now()).format("MM"));
  const year = Number(moment(Date.now()).format("YYYY"));
  const time = moment(Date.now()).format("LT");
  let headlinesArray = [];
  headlinesArray.push(await getBBCnews())
  headlinesArray.push(await getDailyMail())
  headlinesArray.push(await getEveningStandard())
  headlinesArray.push(await getTheGuardian())
  headlinesArray.push(await getMorningStar())
  headlinesArray.push(await getLaVanguardia())
  headlinesArray.push(await getElPais())
  headlinesArray.push(await getElMundo())
  headlinesArray.push(await getVeinteMinutos())
  headlinesArray.push(await getElPeriodico())
  headlinesArray.push(await getElConfidencial())
  headlinesArray.push(await getExpansion())
  headlinesArray.push(await getElMundoToday())

  headlinesArray = headlinesArray.map(arr => { //arr => [newspaper, headline]
    return new Headlines ({
      hash:  hashSum(`${arr[0]}${arr[1]}`),
      day,
      month,
      year,
      time,
      newspaper: arr[0],
      headline: arr[1],
      locale: arr[2],
    })
  })
  return headlinesArray;
}

module.exports = fetchHeadlines;





