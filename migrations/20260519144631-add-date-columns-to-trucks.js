'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adăugăm coloanele noi în tabelul Trucks
    await queryInterface.addColumn('Trucks', 'year', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'purchaseDate', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'rcaStartDate', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'rcaExpiry', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'itpStartDate', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'itpExpiry', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'rovinietaStartDate', { type: Sequelize.STRING });
    await queryInterface.addColumn('Trucks', 'rovinietaExpiry', { type: Sequelize.STRING });
  },

  down: async (queryInterface, Sequelize) => {
    // Dacă vrem să dăm "undo", ștergem coloanele
    await queryInterface.removeColumn('Trucks', 'year');
    await queryInterface.removeColumn('Trucks', 'purchaseDate');
    await queryInterface.removeColumn('Trucks', 'rcaStartDate');
    await queryInterface.removeColumn('Trucks', 'rcaExpiry');
    await queryInterface.removeColumn('Trucks', 'itpStartDate');
    await queryInterface.removeColumn('Trucks', 'itpExpiry');
    await queryInterface.removeColumn('Trucks', 'rovinietaStartDate');
    await queryInterface.removeColumn('Trucks', 'rovinietaExpiry');
  }
};