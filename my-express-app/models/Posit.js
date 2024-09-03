const db = require('../db');

const Posit = {
  getAll: (callback) => {
    db.query('SELECT * FROM posit', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM posit WHERE Posit_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query('INSERT INTO posit SET ?', data, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.insertId);
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE posit SET ? WHERE Posit_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM posit WHERE Posit_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Posit;
