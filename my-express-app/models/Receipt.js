const db = require('../db');
const crypto = require('crypto');

function generateRandomId() {
    return crypto.randomBytes(4).toString('hex');
}

const Receipt = {
  getAll: (callback) => {
    db.query('SELECT * FROM receipt', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  get: (callback) => {
    const query = `
        SELECT 
        r.*, 
        c.Customer_ID, 
        c.Customer_Fname,
        c.Customer_Lname,
        car.RegisterPlateNo, 
        d. Checkin_DateTime,
        d. Checkout_DateTime,
        t.Type_name,
        p.Parking_ID
      FROM 
        receipt r
      JOIN 
        deposit d ON r.Deposit_ID = d.Deposit_ID
      JOIN 
        customer c ON d.Customer_ID = c.Customer_ID
      JOIN
        car car ON d.Car_ID = car.Car_ID
      JOIN 
        type t ON d.Type_ID = t.Type_ID
      LEFT JOIN
        parking p ON d.Parking_ID = p.Parking_ID;
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
        r.*, 
        c.Customer_Fname, 
        c.Customer_Lname,
        car.RegisterPlateNo, 
        t.Type_name,
        p.Parking_ID
      FROM 
        receipt r
      JOIN 
        deposit d ON r.Deposit_ID = d.Deposit_ID
      JOIN 
        customer c ON d.Customer_ID = c.Customer_ID
      JOIN
        car car ON d.Car_ID = car.Car_ID
      JOIN 
        type t ON d.Type_ID = t.Type_ID
      LEFT JOIN
        parking p ON d.Parking_ID = p.Parking_ID
      WHERE 
        r.Deposit_ID = ?;
    `;
  
    db.query(query, [id], (err, results) => {
      if (err) return callback(err, null);
      callback(null, results[0]);
    });
  },  
  
  create: (data, callback) => {

    const randomId = generateRandomId();
  
    data.Receipt_ID = randomId;

    db.query('INSERT INTO receipt SET ?', data, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        const depositId = data.Deposit_ID;

        db.query(
            "SELECT Parking_ID FROM deposit WHERE Deposit_ID = ?",
            [depositId],
            (selectErr, selectResults) => {
                if (selectErr) {
                    return callback(selectErr, null);
                }

                const parkingId = selectResults[0].Parking_ID;

                db.query(
                    "UPDATE parking SET PStatus_ID = ? WHERE Parking_ID = ?",
                    ["1", parkingId],
                    (updateErr, updateResults) => {
                        if (updateErr) {
                            return callback(updateErr, null);
                        }

                        callback(null, { receiptId: results.insertId, updateResults });
                    }
                );
            }
        );
    });
},

  update: (id, data, callback) => {
    db.query('UPDATE receipt SET ? WHERE Receipt_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },
  
  delete: (id, callback) => {
    db.query('DELETE FROM receipt WHERE Receipt_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

module.exports = Receipt;
