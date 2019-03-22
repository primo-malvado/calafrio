const { ApolloServer } = require('apollo-server');
const getUser = require('./getUser');

const typeDefs = require('./schema');
const resolvers = require('./resolvers');

const db = require('./db');
//const store = db.conn;
const models = db.models;


//const dataSources = require('./datasources')(store);
const createLoaders = require('./createLoaders')(db.conn, models);


const context = async ({ req }) => {




  var contextData = {
    models,
    user: getUser(req),
    //store:store,
    loaders: createLoaders()
  };



  return contextData;
};

// Set up Apollo Server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  /*
  dataSources: function(){
    return dataSources;
  },
  */
  context,

});


server
  .listen({ port: 4000 })
  .then(({ url }) => console.log(`🚀 app running at ${url}`));
