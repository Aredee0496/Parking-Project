const db = require('../db');

const Customer = {
  getAll: (callback) => {
    db.query(`
      SELECT c.*, GROUP_CONCAT(car.RegisterPlateNo) AS RegisterPlateNo
      FROM customer c
      LEFT JOIN car ON c.Customer_ID = car.Customer_ID
      GROUP BY c.Customer_ID
    `, (err, results) => {
      if (err) {
        return callback(err, null);
      }
      results.forEach(customer => {
        customer.RegisterPlateNo = customer.RegisterPlateNo ? customer.RegisterPlateNo.split(',') : [];
      });
      callback(null, results);
    });
  },

  getById: (id, callback) => {
    db.query(`
      SELECT c.*, GROUP_CONCAT(car.RegisterPlateNo) AS RegisterPlateNo
      FROM customer c
      LEFT JOIN car ON c.Customer_ID = car.Customer_ID
      WHERE c.Customer_ID = ?
      GROUP BY c.Customer_ID
    `, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      if (results.length > 0) {
        results[0].RegisterPlateNo = results[0].RegisterPlateNo ? results[0].RegisterPlateNo.split(',') : [];
      }
      callback(null, results[0]);
    });
  },

  create: (data, callback) => {
    if (!data || !data.Customer_Fname || !data.Customer_Lname || !data.Customer_Username || !data.Customer_Password || !data.Customer_Tel) {
      return callback(new Error('Missing required customer data'), null);
    }
  
    getNextCustomerId((err, newId) => {
      if (err) return callback(err, null);
  
      const newCustomerData = { ...data, Customer_ID: newId };
      db.query('INSERT INTO customer SET ?', newCustomerData, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return callback(err, null);
        }
        callback(null, newId);
      });
    });
  },

  update: (id, data, callback) => {
    db.query('UPDATE customer SET ? WHERE Customer_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM customer WHERE Customer_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

const getNextCustomerId = (callback) => {
  db.query('SELECT MAX(Customer_ID) AS maxId FROM customer', (err, results) => {
    if (err) return callback(err);

    let newId = 'C01';
    if (results[0].maxId) {
      const currentMaxId = results[0].maxId;
      const currentNumber = parseInt(currentMaxId.substring(1), 10);
      if (!isNaN(currentNumber)) {
        newId = `C${(currentNumber + 1).toString().padStart(2, '0')}`;
      }
    }
    callback(null, newId);
  });
};

module.exports = Customer;
