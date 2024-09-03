const db = require('../db');

const Reservationstatus = {
  getAll: (callback) => {
    db.query('SELECT * FROM reservationstatus', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM reservationstatus WHERE RStatus_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query('INSERT INTO reservationstatus SET ?', data, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.insertId);
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE reservationstatus SET ? WHERE RStatus_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM reservationstatus WHERE RStatus_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Reservationstatus;
