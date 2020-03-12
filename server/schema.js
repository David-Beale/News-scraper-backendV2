const { gql } = require("apollo-server");

const typeDefs = gql`
  type Query {
    headline (newspaper: String, day: Int, month: Int, year: Int, _id:ID ): [Headlines]
    html (name: String): Html
    refresh (name: String): String
  }
  type Mutation {
    addFeed (website: String, name: String, titlePath: [Int], titleRoot: String, summaryPath: [Int], linkPath: [Int], imagePath: [Int], imageTag: String): Feed
    deleteHeadline (id: String): String
    deleteScraper (id: String): String
  }

  type Feed {
    website: String
    name: String
    id: ID!
  }
  type Headlines {
    id: ID!
    day : Int
    month : Int
    year : Int
    time: String
    newspaper: String
    headline: String
    summary: String
    link: String
    image: String
    scraperID: String
  }

  type Html {
    htmlBody: String
    website: String
    name: String
  }

`;

module.exports = typeDefs;
