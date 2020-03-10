const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    headline (newspaper: String, day: Int, month: Int, year: Int, locale: String, _id:ID ): [Headlines]
    html (name: String): Html
  }
  type Mutation {
    addFeed (website: String, name: String, titlePath: [Int], titleRoot: String, summaryPath: [Int], linkPath: [Int], imagePath: [Int], country: String): Feed
  }

  type Feed {
    website: String
    name: String
    selectorRoot: String
    selectorPath: [Int]
    country: String
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
    summary: String
    link: String
    image: String
  }

  type Html {
    htmlBody: String
    website: String
    name: String
    country: String
  }

`;

module.exports = typeDefs;
