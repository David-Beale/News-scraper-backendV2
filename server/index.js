const { ApolloServer } = require("apollo-server-express");
const express = require("express");
const session = require('express-session');
const passport = require('passport');
const MongoStore = require('connect-mongo')(session);
const PORT = process.env.PORT || 4000;
const cors = require('cors');
require('dotenv').config();
const app = express();
const mongoose = require('mongoose');

const typeDefs = require("./schema");
const resolvers = require("./resolvers");
const storeHeadlines = require("../scraper/store-headlines");
require("./db");

// Passport config
require("./config/passport")(passport);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  playground: true,
  debug: true,

  introspection: true,
  context: ({ req, res }) => ({ req, res })
});

//CORS
app.use(cors({
  credentials: true,
  origin: 'http://localhost:3000',
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

//Bodyparser
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "10mb" }));


//Express Session
app.use(
  session({
    secret: 'mysecret',
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
    resave: false,
    saveUninitialized: false
    // cookie: {maxAge: 60000}
  })
);

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Routes
app.use('/users', require('./routes/users'));
// app.use('/*', require('./routes/graph'));

server.applyMiddleware({ 
  app,
  cors: {
    origin: "http://localhost:3000",
    credentials: true
  }, })

app.listen({ port: PORT }, () => {
  console.log(`🚀 Server ready at port: ${PORT}`);
});


storeHeadlines.store();
setInterval(() => {
  storeHeadlines.store();
}, 3600000);

//restore data backup
