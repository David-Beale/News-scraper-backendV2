const fetchHeadLines = require("./fetch-headlines");
const helper = require('./helper-functions')

module.exports = {
  store: async function () {
    try {
      let saveCounter = 0;
      let duplicateCounter = 0;
      let date = helper.getDate();
      const data = await helper.getData();
      let headlineArray = await fetchHeadLines(date, data);
      helper.saveData(headlineArray, saveCounter, duplicateCounter)
    } catch (error) {
      console.log(error)
    }
  }
}





