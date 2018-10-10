'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Authors', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,        
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,        
      },
      createdAt: {
          defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
          defaultValue: Sequelize.NOW,
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Authors');
  }
};