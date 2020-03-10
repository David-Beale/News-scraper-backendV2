const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs')
const Headlines = require("../server/models/headlines")
const SiteData = require("../server/models/site-data")

module.exports = {
  getHeadline: async function (link, test = false) {
    if (test) return fs.readFileSync('./spec/bbc.html', 'utf8')
    else {
      try {
        const response = await got(link);
        const data = response.body;
        // if(link === 'https://www.dailymail.co.uk/home/index.html' ){
        //   console.log('writing')
        //   fs.writeFileSync('dailyMail.html', data)
        // }
        return data
      } catch (error) {
        console.log(error);
      }
    }
  },
  parseHeadline: function (data, selector, titlePath, titleRoot, summaryPath, linkPath, imagePath, website) {

    const $ = cheerio.load(`${data}`);
    let headline;
    let summary;
    let link;
    let imageLink;
    if (selector) {
      headline = $(selector).first().text().trim();
    } else if (titlePath.length) {
      let targetNode = $(titleRoot)
      let nextNode = targetNode.children()[titlePath[titlePath.length - 2]]
      for (let i = titlePath.length - 3; i >= 0; i--) {
        nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script')[titlePath[i]]
      }
      headline = nextNode.children.filter(child => {
        return child.type === 'text' && child.data.trim().length > 5
      })[0].data.trim();
      console.log(headline)
    }
    if (summaryPath.length) {
      let targetNode = $(titleRoot)
      let nextNode = targetNode.children()[summaryPath[summaryPath.length - 2]]
      for (let i = summaryPath.length - 3; i >= 0; i--) {
        nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script')[summaryPath[i]]
      }
      let children = nextNode.children.filter(child => {
        return child.type === 'text' && child.data.trim().length > 5
      })
      summary = children[0].data.trim();
      console.log(summary)
    }
    if (linkPath.length) {
      let targetNode = $(titleRoot)
      let nextNode = targetNode.children()[linkPath[linkPath.length - 2]]
      for (let i = linkPath.length - 3; i >= 0; i--) {
        nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script')[linkPath[i]]
      }
      link = website + nextNode.attribs.href;
      console.log(link)
    }
    if (imagePath.length) {
      let targetNode = $(titleRoot)
      let nextNode = targetNode.children()[imagePath[imagePath.length - 2]]
      for (let i = imagePath.length - 3; i >= 0; i--) {
        nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script')[imagePath[i]]
      }
      if(nextNode.attribs.src && nextNode.attribs.src[0] === 'h'){
        imageLink = nextNode.attribs.src
      } else {
        imageLink = nextNode.attribs["data-src"]
      }
      console.log(imageLink)
    }
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
  },
  getData: async function () {
    const siteData = await SiteData.find();
    return siteData
  }
}

