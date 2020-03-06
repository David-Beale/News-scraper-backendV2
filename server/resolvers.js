const Headlines = require("./models/headlines");

const resolvers = {
  Query: {
    headline: async (_, args) => {
      if (Object.keys(args).length) {
        return await Headlines.find(args);
      } else {
        return await Headlines.find({}).exec();
      }
    },
  }
};

module.exports = resolvers;



