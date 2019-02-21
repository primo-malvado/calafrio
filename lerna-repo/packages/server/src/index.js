
const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const store = require('./db');
const dataSources = require('./datasources')(store)();


var DataLoader = require('dataloader');

async function getBooksByAuthor(author_ids) {
  var res =  await dataSources.livroAPI.getAll({AuthorId:author_ids});
 

  return author_ids.map(function(autor_id){
    return res.filter(function(item){
      return item.AuthorId == autor_id;
    })

  })
 
  return res;
}
function createLoaders() {
  return {
    booksByAuthor: new DataLoader(ids => getBooksByAuthor(ids)),
    autor: new DataLoader(ids => function(_ids) {

 
      return dataSources.autorAPI.getAll({id: _ids});
    }(ids)),


    livro: new DataLoader(ids => function(_ids) {
      return dataSources.livroAPI.getAll({id: _ids});
    }(ids))

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
