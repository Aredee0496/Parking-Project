const db = require('../db');

const Shuttle = {
  getAll: (callback) => {
    db.query('SELECT * FROM shuttle', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM shuttle WHERE Shuttle_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    // Generate a new Shuttle_ID
    db.query('SELECT COUNT(*) AS count FROM shuttle', (err, results) => {
      if (err) {
        return callback(err, null);
      }

      const count = results[0].count + 1;
      const newId = `Shuttle-${String(count).padStart(2, '0')}`;
      
      // Assign the generated ID to the data object
      data.Shuttle_ID = newId;

      // Insert the new shuttle with the generated ID
      db.query('INSERT INTO shuttle SET ?', data, (err, results) => {
        if (err) {
          return callback(err, null);
        }
        callback(null, newId); // Return the generated ID
      });
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE shuttle SET ? WHERE Shuttle_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM shuttle WHERE Shuttle_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Shuttle;
