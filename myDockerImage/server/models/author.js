'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING
  }, {});
  Author.associate = function(models) {
      
    Author.hasMany(models.Book);      
      
    // associations can be defined here
  };
  return Author;
};