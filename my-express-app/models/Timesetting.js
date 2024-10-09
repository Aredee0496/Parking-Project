const db = require('../db');

const Timesetting = {
  getAll: (callback) => {
    db.query('SELECT * FROM timesetting', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE timesetting SET ? WHERE ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Timesetting;
