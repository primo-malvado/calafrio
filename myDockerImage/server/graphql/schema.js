import { gql } from 'apollo-server';




export default  gql`
 
directive @upper on FIELD_DEFINITION
 


  type Author {
    name: String
    books: [Book]
  }
  type Book{
    title: String @upper
    titleold: String @deprecated(reason: "Use 'titleold'.")    
    
    author: Author
  }

  type Query {
    authors: [Author]
    books: [Book]
  }


directive @auth(
  requires: Role = ADMIN,
) on OBJECT | FIELD_DEFINITION

enum Role {
  ADMIN
  REVIEWER
  USER
  UNKNOWN
}

type User @auth(requires: USER) {
  name: String
  banned: Boolean @auth(requires: ADMIN)
  canPost: Boolean @auth(requires: REVIEWER)
}




#mutation {
#  addAuthor(name: "Terrorista") {
#    name
#  }
#}
 

type Mutation {
  addAuthor(name: String email:String): Author
}    
    
    
`;
    
