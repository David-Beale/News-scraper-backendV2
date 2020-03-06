const Headlines = require("../server/models/headlines")
const fetchHeadLines = require("./fetch-headlines");

async function store () {
  try {
    let saveCounter = 0;
    let duplicateCounter = 0;
    let headlineArray = await fetchHeadLines();
    for (let i = 0; i < headlineArray.length; i++) {
      let bool = await Headlines.exists({ hash: headlineArray[i].hash })
      if (bool) duplicateCounter++
      else {
        saveCounter++
        headlineArray[i].save(function (err) {
          if (err) throw err;
        });
      }
      if (i === headlineArray.length - 1) {
        console.log('ITEMS INSERTED : ', saveCounter)
        console.log('DUPLICATE ITEMS : ', duplicateCounter)
      }
    }
  } catch (error) {
    console.log(error)
  }
}

module.exports = store;





