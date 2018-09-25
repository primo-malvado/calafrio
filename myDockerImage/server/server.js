/*
docker ps
docker exec -it e4ea49a58670 ps -aux
docker exec -it b3e01fcfcce8 kill -9 17



docker-compose up --build 
docker-compose down 

*/

'use strict';

import express from 'express';

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
 
const Migration = sequelize.define('migration', {
    version: {
        type: Sequelize.INTEGER
    } 
    
    
}, {
    
 timestamps: false,
 tableName: 'migration'
    
    

});




// App
const app = express();
app.get('/', (req, res) => {
    var Author = require("./models/author.js")(sequelize, Sequelize);
    
    console.log(Author)
    
    
    
   Author.findOne().then(author => {
  
        res.send('Hello world\n'+ author.get('name'));
}, erro => {
  console.log(erro);
        res.send("erro");
});

     
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

