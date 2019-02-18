'use strict';
module.exports = (sequelize, DataTypes) => {
  const Book = sequelize.define('Book', {
    name: DataTypes.STRING
  }, {});
  Book.associate = function(models) {
    // associations can be defined here
    Book.belongsTo(models.Author/* , { foreignKey: 'autor_id' }*/); 
//    Autor.hasMany(Livro, {as: 'livros', foreignKey: 'autor_id' ,sourceKey: 'id' })

  };
  return Book;
};