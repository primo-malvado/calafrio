import { gql } from 'apollo-server';




export default  gql`
 
directive @upper on FIELD_DEFINITION
 


  type Author {
    name: String
    books: [Book]
  }
  type Book {
    title: String @upper
    titleold: String @deprecated(reason: "Use 'titleold'.")    
    
    author: Author
  }

  type Query {
    authors: [Author]
    books: [Book]
  }



 
mutation {
  addAuthor(name: "Terrorista") {
    name
  }
}


type Mutation {
  addAuthor(name: String): Author
}    
    
    
`;
    
