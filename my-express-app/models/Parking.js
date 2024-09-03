const db = require('../db');

const Parking = {
  getAll: (callback) => {
    const query = `
      SELECT 
        parking.Parking_ID, 
        type.Type_ID,
        type.Type_name, 
        type.Price_Hour, 
        type.Price_Day, 
        parkingstatus.PStatus_name
      FROM 
        parking 
      JOIN 
        type ON parking.Type_ID = type.Type_ID 
      LEFT JOIN 
        parkingstatus ON parking.PStatus_ID = parkingstatus.PStatus_ID;
    `;
    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    const query = `
      SELECT 
        parking.Parking_ID,
        type.Type_ID, 
        type.Type_name, 
        type.Price_Hour, 
        type.Price_Day, 
        parkingstatus.PStatus_name
      FROM 
        parking 
      JOIN 
        type ON parking.Type_ID = type.Type_ID 
      LEFT JOIN 
        parkingstatus ON parking.PStatus_ID = parkingstatus.PStatus_ID
      WHERE parking.Parking_ID = ?;
    `;
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    const generateIDQuery = `
      SELECT 
        COALESCE(MAX(CAST(SUBSTRING(Parking_ID, 2) AS UNSIGNED)), 0) + 1 AS next_id
      FROM parking;
    `;

    db.query(generateIDQuery, (err, result) => {
      if (err) {
        return callback(err, null);
      }

      const nextID = `P${result[0].next_id.toString().padStart(3, '0')}`;
      const query = `
        INSERT INTO parking (Parking_ID, Type_ID, PStatus_ID)
        VALUES (?, ?, ?);
      `;
      const values = [nextID, data.Type_ID, 1]; // Set PStatus_ID to 1
      
      db.query(query, values, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, nextID);
      });
    });
  },

  update: (id, data, callback) => {
    const query = `
      UPDATE parking
      SET PStatus_ID = ?
      WHERE Parking_ID = ?;
    `;
    const values = [ data.PStatus_ID, id];
    db.query(query, values, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    const query = `DELETE FROM parking WHERE Parking_ID = ?;`;
    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Parking;
