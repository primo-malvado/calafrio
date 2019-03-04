const { ApolloServer } = require('apollo-server');
const getUser = require('./getUser');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const store = require('./db');

const dataSources = require('./datasources')(store);
const createLoaders = require('./createLoaders')(store);


const context = async ({ req }) => {




  var contextData = {
    user: getUser(req),
    store:store,
    loaders: createLoaders()
  };



/*

   // get the user token from the headers
   const token = req.headers.authorization || '';
  
   // try to retrieve a user with the token
   const user = getUser(token);
  
   // add the user to the context
   return { user };





  // simple auth check on every request

  const email = Buffer.from(auth, 'base64').toString('ascii');

 

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return contextData;
  // find a user by their email
  const users = await store.User.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  contextData.user = { ...user.dataValues };

*/

  return contextData;
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
