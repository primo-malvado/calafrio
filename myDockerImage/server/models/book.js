'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    title: DataTypes.STRING,
    author_id: DataTypes.INTEGER
  }, {});
  Book.associate = function(models) {
    Book.belongsTo(models.Author);
    // associations can be defined here
  };
  return Book;
};

