// data/ramDatabase.js

// This array acts as our in-memory RAM database.
// If the server restarts, this data resets, perfectly fulfilling the Bronze requirement!
let trucks = [
  {
    id: 1,
    licensePlate: "B 101 TIR",
    brand: "Volv",
    model: "FH16",
    rcaExpiry: "2026-12-31"
  },
  {
    id: 2,
    licensePlate: "CJ 22 CAR",
    brand: "Scania",
    model: "R500",
    rcaExpiry: "2026-10-15"
  }
];

module.exports = { trucks };