const db = require('../db');

const Officer = {
  getAll: (callback) => {
    db.query('SELECT * FROM officer', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM officer WHERE Officer_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    db.query('SELECT Officer_ID FROM officer ORDER BY Officer_ID DESC LIMIT 1', (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
      
      let newId;
      if (results.length > 0) {
        const lastId = results[0].Officer_ID;
        const lastIdNumber = parseInt(lastId.substring(2)) || 0;
        const newIdNumber = lastIdNumber + 1;
        newId = `OF${String(newIdNumber).padStart(3, '0')}`;
      } else {
        newId = 'OF001';
      }
      
      const officerWithId = { ...data, Officer_ID: newId };
      console.log('Inserting data:', officerWithId); // Log data for debugging
      db.query('INSERT INTO officer SET ?', officerWithId, (err, results) => {
        if (err) {
          console.error('Database error:', err); // Log error for debugging
          return callback(err, null);
        }
        callback(null, newId);
      });
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE officer SET ? WHERE Officer_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM officer WHERE Officer_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Officer;