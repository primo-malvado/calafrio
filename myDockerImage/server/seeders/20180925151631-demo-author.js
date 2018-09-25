'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkInsert('Authors', [
          {name: 'Antonio Lobo Antunes', createdAt: new Date(), updatedAt: new Date()},
          {name: 'Jose Cardoso Pires', createdAt: new Date(), updatedAt: new Date()},
          {name: 'Grabriel Garcia Marques', createdAt: new Date(), updatedAt: new Date()},
          {name: 'José Saramago', createdAt: new Date(), updatedAt: new Date()},
      
        ], {});
 
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Authors', null, {});
 
  }
};
