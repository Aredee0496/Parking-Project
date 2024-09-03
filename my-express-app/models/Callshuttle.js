const db = require('../db');

const Callshuttle = {
  getAll: (callback) => {
    const query = `
      SELECT
        cs.CallShuttle_ID,
        cs.Shuttle_ID,
        d.Parking_ID,
        cs.People,
        s.CS_Status_name,
        c.Customer_Fname,
        c.Customer_Lname
      FROM
        callshuttle cs
      JOIN
        deposit d ON cs.Deposit_ID = d.Deposit_ID
      JOIN
        customer c ON d.Customer_ID = c.Customer_ID
      JOIN
        callshuttlestatus s ON cs.CS_Status_ID = s.CS_Status_ID
    `;

    db.query(query, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      console.log(results); 
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM callshuttle WHERE CallShuttle_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query('INSERT INTO callshuttle SET ?', data, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.insertId);
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE callshuttle SET ? WHERE CallShuttle_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }

      db.query('UPDATE callshuttle SET CS_Status_ID = 2 WHERE CallShuttle_ID = ?', [id], (err, statusResults) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, results);
      });
    });
  },
  

  delete: (id, callback) => {
    db.query('DELETE FROM callshuttle WHERE CallShuttle_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Callshuttle;