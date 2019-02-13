
const { ApolloServer } = require('apollo-server');
const isEmail = require('isemail');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');
const { createStore, createCon } = require('./db');

const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');
const AutorAPI = require('./datasources/autor');

const LivroAPI = require('./datasources/livro');


// creates a sequelize connection once. NOT for every request
const db = createCon();
const store = createStore(db);

var data = {
  launchAPI: new LaunchAPI(),
  userAPI: new UserAPI({ store }),
  autorAPI: new AutorAPI({store}),
  livroAPI: new LivroAPI({store}),
};

const dataSources = function(){
  return data;
};





const context = async ({ req }) => {
  // simple auth check on every request
  const auth = (req.headers && req.headers.authorization) || '';
  const email = Buffer.from(auth, 'base64').toString('ascii');


  //Buffer.from(string, encoding) 
  console.log("auth", auth);
  console.log("email", email);

  // if the email isn't formatted validly, return null for user
  if (!isEmail.validate(email)) return { user: null };
  // find a user by their email
  const users = await store.users.findOrCreate({ where: { email } });
  const user = users && users[0] ? users[0] : null;

  return { user: { ...user.dataValues } };
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources,
  context,

});


  server
    .listen({ port: 4000 })
    .then(({ url }) => console.log(`🚀 app running at ${url}`));
