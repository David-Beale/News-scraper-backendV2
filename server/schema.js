const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    headline (newspaper: String, day: Int, month: Int, year: Int, locale: String, _id:ID ): [Headlines]
    html (website: String): Html
  }

  type Headlines {
    id: ID!
    day : Int
    month : Int
    year : Int
    time: String
    newspaper: String
    headline: String
    locale: String
  }
  type Html {
    website: String
  }

`;

module.exports = typeDefs;
