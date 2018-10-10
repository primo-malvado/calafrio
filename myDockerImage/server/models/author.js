'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: { type: DataTypes.STRING, allowNull: false},
    email: { type: DataTypes.STRING, allowNull: false,  validate: { isEmail:true}},
  }, {});
  Author.associate = function(models) {
      
    Author.hasMany(models.Book);      
      
    // associations can be defined here
  };
  return Author;
};