'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
 /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
      return queryInterface.bulkInsert('Books', [
          {title: 'Cus de judas',author_id:1,createdAt: new Date(), updatedAt: new Date()},
          {title: 'ordem natural das coisas',author_id:1,createdAt: new Date(), updatedAt: new Date()},
          {title: 'Balada da praia dos cães',author_id:2,createdAt: new Date(), updatedAt: new Date()},
          {title: 'Cem anos de solidão',author_id:3,createdAt: new Date(), updatedAt: new Date()},
          {title: 'Evangelho segundo JS',author_id:4,createdAt: new Date(), updatedAt: new Date()},
          {title: 'Todos os nome',author_id:4,createdAt: new Date(), updatedAt: new Date()},
      
        
        
        ], {});
 
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      */
     return queryInterface.bulkDelete('Books', null, {});
     
  }
};
