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
  
    const checkUsernameQuery = 'SELECT Customer_ID FROM customer WHERE Customer_Username = ?';
    
    db.query(checkUsernameQuery, [data.Customer_Username], (err, results) => {
      if (err) {
        console.error('Database error:', err);
        return callback(err, null);
      }
  
      if (results.length > 0) {
        return callback(new Error('Username already exists'), null);
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
    });
  },
  

  register: (data, callback) => { 
    if (!data || !data.Customer_Fname || !data.Customer_Lname || !data.Customer_Username || !data.Customer_Password || !data.Customer_Tel || !data.RegisterPlateNo) {
        return callback(new Error('Missing required customer or car data'), null);
    }

    db.query('SELECT * FROM customer WHERE Customer_Username = ?', [data.Customer_Username], (err, results) => {
        if (err) {
            console.error('Database error during username check:', err);
            return callback(err, null);
        }

        if (results.length > 0) {
            return callback(new Error('Customer_Username already exists'), null);
        }

        getNextCustomerId((err, newCustomerId) => {
            if (err) return callback(err, null);

            const newCustomerData = { 
                Customer_ID: newCustomerId,
                Customer_Fname: data.Customer_Fname,
                Customer_Lname: data.Customer_Lname,
                Customer_Username: data.Customer_Username,
                Customer_Password: data.Customer_Password,
                Customer_Tel: data.Customer_Tel
            };
            
            db.query('INSERT INTO customer SET ?', newCustomerData, (err, results) => {
                if (err) {
                    console.error('Database error during customer creation:', err);
                    return callback(err, null);
                }

                const registerPlateNo = data.RegisterPlateNo[0]; 

                getNextCarId((err, newCarId) => {
                    if (err) return callback(err, null);

                    const newCarData = { 
                        Car_ID: newCarId, 
                        RegisterPlateNo: registerPlateNo,
                        Customer_ID: newCustomerId 
                    };

                    db.query('INSERT INTO car SET ?', newCarData, (err, results) => {
                        if (err) {
                            console.error('Database error during car creation:', err);
                            return callback(err, null);
                        }
                        
                        callback(null, { newCustomerId, newCarId });
                    });
                });
            });
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

const getNextCarId = (callback) => {
  db.query('SELECT MAX(Car_ID) AS maxId FROM car', (err, results) => {
    if (err) return callback(err);

    let newId = 'CA01'; 
    if (results[0].maxId) {
      const currentMaxId = results[0].maxId;
      const currentNumber = parseInt(currentMaxId.substring(2), 10); 
      if (!isNaN(currentNumber)) {
        newId = `CA${(currentNumber + 1).toString().padStart(2, '0')}`;
      }
    }
    callback(null, newId);
  });
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
