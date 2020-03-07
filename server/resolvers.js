const Headlines = require("./models/headlines");
const fs = require('fs')

const resolvers = {
  Query: {
    headline: async (_, args) => {
      if (Object.keys(args).length) {
        return await Headlines.find(args);
      } else {
        return await Headlines.find({}).exec();
      }
    },
    html: async (_, args) => {
      if (Object.keys(args).length) {
        const html = JSON.stringify(fs.readFileSync('../spec/bbc.html','utf8'))
        return {website:html}
      } 
    }
  }
};

module.exports = resolvers;



