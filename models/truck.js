'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Truck extends Model {
    static associate(models) {
      // define association here
    }
  }
  Truck.init({
    licensePlate: DataTypes.STRING,
    brand: DataTypes.STRING,
    model: DataTypes.STRING,
    companyId: DataTypes.INTEGER,
    // --- AM ADĂUGAT CÂMPURILE LIPSĂ DE MAI JOS ---
    year: DataTypes.STRING,
    purchaseDate: DataTypes.STRING,
    rcaStartDate: DataTypes.STRING,
    rcaExpiry: DataTypes.STRING,
    itpStartDate: DataTypes.STRING,
    itpExpiry: DataTypes.STRING,
    rovinietaStartDate: DataTypes.STRING,
    rovinietaExpiry: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Truck',
  });
  return Truck;
};