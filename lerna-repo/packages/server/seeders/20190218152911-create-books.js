'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert('Books', [
        {name: 'Memória de elefante', createdAt: new Date(), updatedAt: new Date() , AuthorId: 1},
        {name: 'Cus de Judas', createdAt: new Date(), updatedAt: new Date() , AuthorId: 1},
        {name: 'Manual do inquisidor', createdAt: new Date(), updatedAt: new Date() , AuthorId: 1},

        {name: 'Evangelho segundo JC', createdAt: new Date(), updatedAt: new Date() , AuthorId: 2},
        {name: 'Todos os nomes', createdAt: new Date(), updatedAt: new Date() , AuthorId: 2},


        {name: 'Mensagem', createdAt: new Date(), updatedAt: new Date() , AuthorId: 3},
      ], {});
  },

  down: (queryInterface, Sequelize) => {
 
      return queryInterface.bulkDelete('Books', null, {});
 
  }
};
