const { gql } = require('apollo-server');
/*
const typeDefs = gql`
  type Query {
    
    launches(
      pageSize: Int
      after: String
    ): LaunchConnection!
    launch(id: ID!): Launch
    me: User
    
    posts: [Post]
    
    autores: [Autor]
    books: [Livro]
    categories: [Category]

  }

  type Mutation {
    # if false, signup failed -- check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    # if false, cancellation failed -- check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String # login token

    createAuthor(data: AuthorReq!): Autor

  }


  input AuthorReq {
    name: String
    #livros: [Livro]
  }


  type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
  }

  """
  Simple wrapper around our list of launches that contains a cursor to the
  last item in the list. Pass this cursor to the launches query to fetch results
  after these.
  """
  type LaunchConnection {
    cursor: String!
    hasMore: Boolean!
    launches: [Launch]!
  }

  type Autor {
    id: ID!
    name: String
    livros: [Livro]
  }

  type Livro {
    id: ID!
    name: String
    autor: Autor
  }
  type Category {
    id: ID!
    description: String
  }


  type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
  }

  type Rocket {
    id: ID!
    name: String
    type: String
  }

  type User {
    id: ID!
    email: String!
    trips: [Launch]!
  }

  type Mission {
    name: String
    missionPatch(size: PatchSize): String
  }

  enum PatchSize {
    SMALL
    LARGE
  }
`;
*/




const typeDefs = gql`
  type Query {
    posts: [Post]
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
