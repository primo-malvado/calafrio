'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('Authors', [
        {name: 'António Lobo Antunes', createdAt: new Date(), updatedAt: new Date() 
      },
        {name: 'José Saramago', createdAt: new Date(), updatedAt: new Date()},
        {name: 'Fernando Pessoa', createdAt: new Date(), updatedAt: new Date()},
      ], {});
 
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Authors', null, {});
 
  }
};
