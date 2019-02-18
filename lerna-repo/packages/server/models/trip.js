'use strict';
module.exports = (sequelize, DataTypes) => {
  const Trip = sequelize.define('Trip', {
    launchId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER
  }, {});
  Trip.associate = function(models) {
    // associations can be defined here
  };
  return Trip;
};