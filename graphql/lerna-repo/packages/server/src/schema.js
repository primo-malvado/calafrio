const { gql } = require('apollo-server');




const typeDefs = gql`
  type Query {
    posts: [Post]

    me: User!
  }
  type Post {
    id: ID!
    title: String!
    body: String!
    author: User
    comments: [Comment]
  }
  type User {
    id: ID!
    email: String!
    name: String!
    posts: [Post]
  }

  type Comment {
    id: ID!
    text: String!
    author: User!
    post: Post!
  }
 
`;



module.exports = typeDefs;
