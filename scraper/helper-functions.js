const got = require('got');
const cheerio = require('cheerio');
const moment = require('moment');
const fs = require('fs')
const Headlines = require("../server/models/headlines")
const SiteData = require("../server/models/site-data")

let counter = 0;
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
  parseHeadline: function (data, titlePath, titleRoot, summaryPath, linkPath, imagePath, website, imageTag) {

    const $ = cheerio.load(`${data}`);
    let images = Object.values($('img'))
    try {
      images.forEach(image => {
        if (image.attribs && image.attribs['data-src'] && image.attribs['data-src'][0] === 'h') {
          image.attribs['src'] = image.attribs['data-src']
        } else if (image.parent && image.parent.attribs && image.parent.attribs['data-src'] && image.parent.attribs['data-src'][0] === 'h') {
          image.attribs['src'] = image.parent.attribs['data-src']
        }
      })
    } catch (error) {
      console.log(error)
    }
    let headline;
    let summary;
    let link;
    let image;
    if (titlePath.length) {
      try {
        let targetNode = $(titleRoot)
        let nextNode = targetNode.children()[titlePath[titlePath.length - 1]]
        for (let i = titlePath.length - 2; i >= 0; i--) {
          nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script' || child.type === 'style')[titlePath[i]]
        }
        headline = nextNode.children.filter(child => {
          return child.type === 'text' && child.data.trim().length > 5
        })[0].data.trim();
      } catch (error) {
        headline = 'Failed to scrape'
      }
    }
    if (summaryPath.length) {
      try {
        let targetNode = $(titleRoot)
        let nextNode = targetNode.children()[summaryPath[summaryPath.length - 1]]
        for (let i = summaryPath.length - 2; i >= 0; i--) {
          nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script' || child.type === 'style')[summaryPath[i]]
        }
        let children = nextNode.children.filter(child => {
          return child.type === 'text' && child.data.trim().length > 5
        })
        if (children[0] && children[0].data) {
          summary = children[0].data.trim();
        } else {
          for (let i = 0; i < nextNode.children.length; i++) {
            if (nextNode.children[i].children) {
              let child = (nextNode.children[i].children.filter(child => {
                return child.type === 'text' && child.data.trim().length > 5
              }))
              if (child[0] && child[0].data) {
                summary = child[0].data.trim();
                i = nextNode.children.length
              }
            }
          }
        }
      } catch (error) {
        summary = 'Failed to scrape'
      }
    }
    if (linkPath.length) {
      try {
        let targetNode = $(titleRoot)
        let nextNode = targetNode.children()[linkPath[linkPath.length - 1]]
        for (let i = linkPath.length - 2; i >= 0; i--) {
          nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script' || child.type === 'style')[linkPath[i]]
        }
        const regex = "^(?:https?:\/\/)?(?:[^@\/\n]+@)?(?:www\.)?([^:\/?\n]+)"
        const concatLink = website.match(regex)[0];
        if (nextNode.attribs.href[0] === 'h') link = (nextNode.attribs.href)
        else link = (concatLink + nextNode.attribs.href)
      } catch (error) {
        link = 'Failed to scrape'
      }
    }
    if (imagePath.length) {
      try {
        let targetNode = $(titleRoot)
        let nextNode = targetNode.children()[imagePath[imagePath.length - 1]]
        for (let i = imagePath.length - 2; i >= 0; i--) {
          nextNode = nextNode.children.filter(child => child.type === 'tag' || child.type === 'script' || child.type === 'style')[imagePath[i]]
        }
        image = nextNode.attribs[imageTag]
      } catch (error) {
        image = 'Failed to scrape'
      }
    }
    return { headline, summary, link, image };
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
