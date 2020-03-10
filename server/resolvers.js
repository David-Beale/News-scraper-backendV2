const Headlines = require("./models/headlines");
const SiteData = require("./models/site-data");
const got = require('got');

const resolvers = {
  Query: {
    headline: async (_, args) => {
      if (Object.keys(args).length) {
        return await Headlines.find(args);
      } else {
        return await Headlines.find();
      }
    },
    html: async (_, args) => {
      if (Object.keys(args).length) {
        const siteData = await SiteData.findOne(args);
        const {website, name, country} = siteData;
        html = await got(website);
        return {htmlBody: html.body, website, name, country}
      }else {
        return await SiteData.find();
      }
    }
  },
  Mutation: {
    addFeed: (root, args) => {
      console.log('adding feed')
      const {website, name, titlePath, titleRoot, summaryPath, linkPath, imagePath,  country } = args
      const newFeed = new SiteData({
        website, name, titlePath, titleRoot, summaryPath, linkPath, imagePath, country
      })
      return newFeed.save();
      // return SiteData.find(args);
    }
  }
};

module.exports = resolvers;



