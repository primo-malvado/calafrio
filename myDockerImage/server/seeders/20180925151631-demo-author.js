'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkInsert('Authors', [
          {name: 'Antonio Lobo Antunes', email:"sss@ggg.pt", createdAt: new Date(), updatedAt: new Date()},
          {name: 'Jose Cardoso Pires', email:"sss@ggg.pt",  createdAt: new Date(), updatedAt: new Date()},
          {name: 'Grabriel Garcia Marques', email:"sss@ggg.pt",  createdAt: new Date(), updatedAt: new Date()},
          {name: 'José Saramago', email:"sss@ggg.pt",  createdAt: new Date(), updatedAt: new Date()},
      
        ], {});
 
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Authors', null, {});
 
  }
};
