'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 
      var list = [];
      for(var i = 0;i< 100; i++){
        list.push({description: 'Teste '+i, createdAt: new Date(), updatedAt: new Date()});
      }

      return queryInterface.bulkInsert('Categories', list, {});
 
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
    */
      return queryInterface.bulkDelete('Categories', null, {});
  }
};
