import { gql } from 'apollo-server';

// Type definitions define the "shape" of your data and specify
// which ways the data can be fetched from the GraphQL server.
export default  gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  type Author {
    name: String
    books: [Book]
  }
  type Book {
    title: String
    author: Author
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    authors: [Author]
    books: [Book]
  }
`;


