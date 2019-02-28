const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const store = require('./db');
const dataSources = require('./datasources')(store)();

var DataLoader = require('dataloader');

 
function createLoaders() {
  return {

    user: new DataLoader(ids => function(ids) {

       return store.table('users')
            .whereIn('id', ids)
            .select()
            .then(rows => ids.map(id => rows.find(x => x.id === id)));
   
      }(ids)),

    commentsByPostId: new DataLoader(ids => function(ids) {

     return store.table('comments')
          .whereIn('post_id',  ids)
          .select()
          .then(rows => { 
            return ids.map(id => rows.filter(x => x.post_id === id))

          });
 
    }(ids)),



/*

    //booksByAuthor: new DataLoader(author_ids => getBooksByAuthor(author_ids)),

    booksByAuthor: new DataLoader(ids => function(ids) {

     return store.table('Books')
          .whereIn('AuthorId',  ids)
          .select()
          .then(rows => { 
            return ids.map(id => rows.filter(x => x.AuthorId === id))

          });
 
    }(ids)),





    autor: new DataLoader(ids => function(ids) {

       return store.table('Authors')
            .whereIn('id', ids)
            .select()
            .then(rows => ids.map(id => rows.find(x => x.id === id)));
   
      }(ids)),


    livro: new DataLoader(ids => function(_ids) {


     return store.table('Books')
          .whereIn('id', _ids)
          .select()
          .then(rows => _ids.map(id => rows.find(x => x.id === id)));

    }(ids))
    */

  };
}


const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');

 

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null ,
    store:store,
    loaders: createLoaders()};
  // find a user by their email
  const users = await store.User.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { 
    store:store,
    user: { ...user.dataValues } ,
    loaders: createLoaders()

  };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: function(){
    return dataSources;
  },
  context,

});


server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`🚀 app running at ${url}`));
