const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs')
const Headlines = require("../server/models/headlines")

module.exports = {
	getHeadline: async function (link, test = false) {
		if (test) return fs.readFileSync('./spec/bbc.html', 'utf8')
		else {
			try {
				const response = await got(link);
				const data = response.body;
				return data
			} catch (error) {
				console.log(error.response.body);
			}
		}
	},
	parseHeadline: function (data, selector) {
		const $ = cheerio.load(`${data}`);
		const headline = $(selector).first().text().trim();
		return headline;
	},
	getDate: function () {
		return [Number(moment(Date.now()).format("DD")), Number(moment(Date.now()).format("MM")),
		Number(moment(Date.now()).format("YYYY")), moment(Date.now()).format("LT")]
	},
	saveData: async function (headlineArray, saveCounter, duplicateCounter, test = false) {
		for (let i = 0; i < headlineArray.length; i++) {
			if (test) headlineArray[i].hash = Date.now();
			let bool = await Headlines.exists({ hash: headlineArray[i].hash })
			if (bool) {
				duplicateCounter++
			}
			else {
				saveCounter++
				headlineArray[i].save(function (err) {
					if (err) throw err;
				});
			}
			if (i === headlineArray.length - 1) {
				console.log('ITEMS INSERTED : ', saveCounter)
				console.log('DUPLICATE ITEMS : ', duplicateCounter)
				return (`ITEMS INSERTED :  ${saveCounter} DUPLICATE ITEMS :  ${duplicateCounter}`)
			}
		}
	}
}
