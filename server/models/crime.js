'use strict';
module.exports = function(sequelize, DataTypes) {
  var Crime = sequelize.define('Crime', {
    year: DataTypes.INTEGER,
    population: DataTypes.INTEGER,
    violent_crime: DataTypes.INTEGER,
    murder_and_manslaughter: DataTypes.INTEGER,
    rape: DataTypes.INTEGER,
    robbery: DataTypes.INTEGER,
    aggravated_assault: DataTypes.INTEGER,
    property_crime: DataTypes.INTEGER,
    burglary: DataTypes.INTEGER,
    larceny_theft: DataTypes.INTEGER,
    motor_vehicle_theft: DataTypes.INTEGER,
    arson: DataTypes.INTEGER,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
        indexes: [
            {
                unique: false,
                fields: ['state', 'city']
            }
        ]
  },{
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Crime;
};