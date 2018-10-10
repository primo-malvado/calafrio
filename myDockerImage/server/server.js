/*
docker-compose up --build 
docker-compose down 
*/

import express from 'express'
import {ApolloServer} from 'apollo-server-express';

import typeDefs from './graphql/schema'
import resolvers from './graphql/resolvers'
import fs from 'fs'
import https from 'https'
import http from 'http'

// Constants
import UpperCaseDirective from './graphql/directives/UpperCaseDirective'
import AuthDirective from './graphql/directives/AuthDirective'

import Sequelize from 'sequelize';
const sequelize = new Sequelize('practicedocker', 'postgres', 'password', {
    host: 'db',
    dialect: 'postgres',
    operatorsAliases: false,

    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});


var contextModel = {
 Author: require("./models/author.js")(sequelize, Sequelize),
 Book: require("./models/book.js")(sequelize, Sequelize)
};

var dataloaders = require("./models/dataloaders.js")(contextModel);


const configurations = {
    // Note: You may need sudo to run on port 443
    production: {
        ssl: true,
        port: 443,
        hostname: '0.0.0.0'
    },
    development: {
        ssl: false,
        port: 8080,
        hostname: '0.0.0.0'
    }
}

const environment = process.env.NODE_ENV || 'development'
const config = configurations[environment]

 

const apollo = new ApolloServer({
 /*
   formatError: error => {
    console.log(error);
    return new Error('Internal server error');
  },
    */
    typeDefs,
    resolvers,
   schemaDirectives: {
    upper: UpperCaseDirective,
    upperCase: UpperCaseDirective,
    auth: AuthDirective,
    authorized: AuthDirective,
    authenticated: AuthDirective    
},
    context: ({req}) => {
        
        console.log(Object.keys(arguments[0]));
        
        return {

            dataloaders: dataloaders,
            models:contextModel

        };
    },

});


const app = express()
apollo.applyMiddleware({
    app
});

// Create the HTTPS or HTTP server, per configuration
var server;

if (config.ssl) {
    // Assumes certificates are in .ssl folder from package root. Make sure the files
    // are secured.
    server = https.createServer({
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

server.listen({
        port: config.port
    }, () =>
    console.log(
        '🚀 Server ready at',
        `http${config.ssl ? 's' : ''}://${config.hostname}:${config.port}${apollo.graphqlPath}`
    )
)