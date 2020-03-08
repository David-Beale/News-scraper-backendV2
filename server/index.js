const { ApolloServer } = require("apollo-server");
const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const storeHeadlines = require("../scraper/store-headlines");
require('dotenv').config();

require("./db");

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  cors: true,
  debug: true,
  introspection: true,
});

const PORT = process.env.PORT || 4000;

server.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at port: ${PORT}`);
});


storeHeadlines.store();
setInterval(() => {
  storeHeadlines.store();
}, 3600000);

//restore data backup
