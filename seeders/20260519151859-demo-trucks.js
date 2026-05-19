'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const dummyTrucks = [];
    
    // Generăm 20 de camioane automat
    for (let i = 1; i <= 20; i++) {
      dummyTrucks.push({
        licensePlate: `SB ${i < 10 ? '0' + i : i} DEM`, // Va genera SB 01 DEM, SB 02 DEM...
        brand: i % 2 === 0 ? 'Volvo' : 'Scania',       // Alternează între Volvo și Scania
        model: i % 2 === 0 ? 'FH16' : 'R500',
        year: '2023',
        purchaseDate: '2023-05-10',
        rcaStartDate: '2025-10-10',
        rcaExpiry: '2026-10-10',
        itpStartDate: '2025-11-15',
        itpExpiry: '2026-11-15',
        rovinietaStartDate: '2026-01-01',
        rovinietaExpiry: '2026-12-31',
        createdAt: new Date(),
        updatedAt: new Date()
      });
    }

    // Le inserăm pe toate dintr-un foc în tabelul Trucks
    await queryInterface.bulkInsert('Trucks', dummyTrucks, {});
  },

  down: async (queryInterface, Sequelize) => {
    // Dacă dăm undo, ștergem tot din tabel
    await queryInterface.bulkDelete('Trucks', null, {});
  }
};