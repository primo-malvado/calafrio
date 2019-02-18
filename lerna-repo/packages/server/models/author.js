'use strict';
module.exports = (sequelize, DataTypes) => {
  const Author = sequelize.define('Author', {
    name: DataTypes.STRING
  }, {});
  Author.associate = function(models) {
    // associations can be defined here
    //Livro.belongsTo(Autor , { foreignKey: 'autor_id' }); 
    Author.hasMany(models.Book/*, {as: 'livros', foreignKey: 'autor_id' ,sourceKey: 'id' }*/)


  };
  return Author;
};