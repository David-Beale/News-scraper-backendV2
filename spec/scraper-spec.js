const helper = require('../scraper/helper-functions')
const fetchHeadLines = require("../scraper/fetch-headlines");
const mock = require("./mock-data");
const storeHeadlines = require("../scraper/store-headlines");
const Headlines = require("../server/models/headlines")
require("../server/db");
const fs = require('fs')

describe("Scraper testing", function() {
  describe("Parse", function () {
    it("correctly parses selected html data", function () {
      const mockData = fs.readFileSync('./spec/bbc.html','utf8')
      const headline = helper.parseHeadline(mockData,'li.media-list__item--1 a.media__link')
      expect(headline).toBe('Coronavirus: Italy closes schools and universities')
    });
  });
  describe("Fetch", function () {
    it("returns an array of formatted db objects", async function () {
      const array = await fetchHeadLines(mock.date,mock.data,true)
      const {hash, day, month, year, time, newspaper, headline, locale} = array[0]
      expect([hash, day, month, year, time, newspaper, headline, locale]).toEqual(mock.fetchResult)
    });
  });
  describe("Store", function () {
    it("duplicate headline should not be stored", async function (done) {
      const mockArray = await fetchHeadLines(mock.date,mock.data,true)
      const result = await helper.saveData(mockArray,0,0)
      expect(result).toBe('ITEMS INSERTED :  0 DUPLICATE ITEMS :  1')
      done()
    });
  });
  describe("Store", function () {
    it("Unique data should be stored", async function (done) {
      const mockArray = await fetchHeadLines(mock.date,mock.data,true)
      mockArray[0].hash = helper.getDate();
      const result = await helper.saveData(mockArray,0,0,true)
      expect(result).toBe('ITEMS INSERTED :  1 DUPLICATE ITEMS :  0')
      done()
    });
  });
});
