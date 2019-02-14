'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 

      Example:
      return queryInterface.bulkInsert('Categories', [
        {description: 'Teste1', createdAt: new Date(), updatedAt: new Date()},
        {description: 'Teste2', createdAt: new Date(), updatedAt: new Date()},
        {description: 'Teste3', createdAt: new Date(), updatedAt: new Date()},
        {description: 'Teste4', createdAt: new Date(), updatedAt: new Date()},
        ], {});
 
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
  }
};
