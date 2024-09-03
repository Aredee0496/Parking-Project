const db = require('../db');

const Callshuttlestatus = {
  getAll: (callback) => {
    db.query('SELECT * FROM callshuttlestatus', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM callshuttlestatus WHERE CS_Status_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query('INSERT INTO callshuttlestatus SET ?', data, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results.insertId);
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE callshuttlestatus SET ? WHERE CS_Status_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM callshuttlestatus WHERE CS_Status_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Callshuttlestatus;
