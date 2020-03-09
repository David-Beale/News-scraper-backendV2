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
        const {website} = siteData;
        html = await got(website);
        return {website: html.body}
      }else {
        return await SiteData.find();
      }
    }
  }
};

module.exports = resolvers;



