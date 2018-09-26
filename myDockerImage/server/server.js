/*
docker-compose up --build 
docker-compose down 


*/

import express from 'express'
import { ApolloServer } from 'apollo-server-express'
import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'
import fs from 'fs'
import https from 'https'
import http from 'http'

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';
 
import Sequelize from 'sequelize';
const sequelize = new Sequelize('practicedocker', 'postgres', 'password', {
  host: 'db',
  dialect:  'postgres' ,
  operatorsAliases: false,

  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});
 
var Author = require("./models/author.js")(sequelize, Sequelize);
var Book = require("./models/book.js")(sequelize, Sequelize);
     
var DataLoader = require('dataloader');
 
const configurations = {
  // Note: You may need sudo to run on port 443
  production: { ssl: true, port: 443, hostname: '0.0.0.0' },
  development: { ssl: false, port: 8080, hostname: '0.0.0.0' }
}

const environment = process.env.NODE_ENV || 'development'
const config = configurations[environment]

 
const apollo = new ApolloServer({ typeDefs, resolvers ,
    
  context: () => {
    return {
        
        dataloaders: {
            booksByAuthorsIds: new DataLoader(function(authorIds)  {
                
                //console.log(authorIds)
                
                var promises =  authorIds.map(function(author_id){
                    return Book.findAll({where: {author_id: author_id}});
                    
                })
                

                return Promise.all(promises);                
                
                
                
            }),
            authorById: new DataLoader(function(author_id)  {
                
                
                return Author.findAll(
                        {
                            where: {
                                id: author_id 
                            }
                        });
            })
        },        
       
        
      Author: Author,
      Book: Book,
    };
  },

});


const app = express()
apollo.applyMiddleware({ app })

// Create the HTTPS or HTTP server, per configuration
var server;

if (config.ssl) {
  // Assumes certificates are in .ssl folder from package root. Make sure the files
  // are secured.
  server = https.createServer(
    {
      key: fs.readFileSync(`./ssl/${environment}/server.key`),
      cert: fs.readFileSync(`./ssl/${environment}/server.crt`)
    },
    app
  )
} else {
  server = http.createServer(app)
}

// Add subscription support
apollo.installSubscriptionHandlers(server)

server.listen({ port: config.port }, () =>
  console.log(
    '🚀 Server ready at',
    `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
  )
)

