const { getBooking } = require("../controllers/Deposit");
const db = require("../db");

const Deposit = {
  getAll: (callback) => {
    const query = `
      SELECT 
        d.*, 
        c.Customer_Fname AS Customer_Fname, 
        c.Customer_Lname AS Customer_Lname,
        t.Type_name AS Type_name, 
        car.RegisterPlateNo AS RegisterPlateNo
      FROM 
        deposit d
      JOIN 
        customer c ON d.Customer_ID = c.Customer_ID
      JOIN 
        type t ON d.Type_ID = t.Type_ID
      LEFT JOIN 
        car ON d.Car_ID = car.Car_ID`;

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
        d.*, 
        c.Customer_Fname AS Customer_Fname, 
        c.Customer_Lname AS Customer_Lname,
        t.Type_name AS Type_name, 
        car.RegisterPlateNo AS RegisterPlateNo
      FROM 
        deposit d
      JOIN 
        customer c ON d.Customer_ID = c.Customer_ID
      JOIN 
        type t ON d.Type_ID = t.Type_ID
      LEFT JOIN 
        car ON d.Car_ID = car.Car_ID
      WHERE d.Deposit_ID = ?`;
    db.query(query, [id], (err, results) => {
      console.log(err)
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

  getCheckin: (id, callback) => {
    const query = `
      SELECT 
      d.*, 
      c.Customer_Fname AS Customer_Fname, 
      c.Customer_Lname AS Customer_Lname,
      o.Officer_Fname AS Officer_Fname, 
      o.Officer_Lname AS Officer_Lname,
      t.Type_name AS Type_name, 
      car.RegisterPlateNo AS RegisterPlateNo,
      s.DepositStatus_name AS DepositStatus_name
    FROM 
      deposit d
    JOIN 
      customer c ON d.Customer_ID = c.Customer_ID
    JOIN 
      Officer o ON d.Officer_ID = o.Officer_ID
    JOIN 
      depositstatus s ON d.DepositStatus_ID = s.DepositStatus_ID
    JOIN 
      type t ON d.Type_ID = t.Type_ID
    LEFT JOIN 
      car ON d.Car_ID = car.Car_ID
    WHERE 
      d.Customer_ID = ? AND 
      d.DepositStatus_ID = 2`;

    db.query(query, [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },

getBooking: (id, callback) => {
  const query = `
    SELECT 
      d.*, 
      c.Customer_Fname AS Customer_Fname, 
      c.Customer_Lname AS Customer_Lname,
      t.Type_name AS Type_name, 
      car.RegisterPlateNo AS RegisterPlateNo,
      s.DepositStatus_name AS DepositStatus_name
    FROM 
      deposit d
    JOIN 
      customer c ON d.Customer_ID = c.Customer_ID
    JOIN 
      depositstatus s ON d.DepositStatus_ID = s.DepositStatus_ID
    JOIN 
      type t ON d.Type_ID = t.Type_ID
    LEFT JOIN 
      car ON d.Car_ID = car.Car_ID
    WHERE 
      d.Customer_ID = ? AND 
      d.DepositStatus_ID = 1`;

  db.query(query, [id], (err, results) => {
    if (err) {
      return callback(err, null);
    }
    callback(null, results[0]);
  });
},
 
  create: (data, callback) => {
    db.query(
      "SELECT Deposit_ID FROM deposit ORDER BY Deposit_ID DESC LIMIT 1",
      (err, results) => {
        if (err) {
          return callback(err, null);
        }

        let newId;
        if (results.length > 0) {
          const lastId = results[0].Deposit_ID;
          const lastNumber = parseInt(lastId.replace("DEP-", ""));

          if (lastNumber >= 9999) {
            newId = `DEP-${lastNumber + 1}`;
          } else {
            newId = `DEP-${String(lastNumber + 1).padStart(4, "0")}`;
          }
        } else {
          newId = "DEP-0001";
        }

        data.Deposit_ID = newId;
        db.query("INSERT INTO deposit SET ?", data, (err, results) => {
          if (err) {
            return callback(err, null);
          }
          callback(null, results.insertId);
        });
      }
    );
  },

  update: (id, data, callback) => {
    
    db.query(
      "UPDATE deposit SET ? WHERE Deposit_ID = ?",
      [data, id],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }
  
        db.query(
          "SELECT Parking_ID FROM deposit WHERE Deposit_ID = ?",
          [id],
          (err, rows) => {
            if (err) {
              return callback(err, null);
            }

            const parkingId = rows[0]?.Parking_ID; 

            db.query(
              "UPDATE parking SET PStatus_ID = ? WHERE Parking_ID = ?",
              ["2", parkingId],
              (err, parkingResults) => {
                if (err) {
                  return callback(err, null);
                }
                callback(null, results);
              }
            );
          }
        );
      }
    );
  },

  delete: (id, callback) => {
    db.query(
      "SELECT Parking_ID FROM deposit WHERE Deposit_ID = ?",
      [id],
      (err, results) => {
        if (err) {
          return callback(err, null);
        }

        const parkingId = results[0].Parking_ID;

        db.query(
          "DELETE FROM deposit WHERE Deposit_ID = ?",
          [id],
          (deleteErr, deleteResults) => {
            if (deleteErr) {
              return callback(deleteErr, null);
            }

            db.query(
              "UPDATE parking SET PStatus_ID = ? WHERE Parking_ID = ?",
              ["1", parkingId],
              (updateErr, updateResults) => {
                if (updateErr) {
                  return callback(updateErr, null);
                }

                callback(null, { deleteResults, updateResults });
              }
            );
          }
        );
      }
    );
  },

  checkAvailability: (typeId, callback) => {
    const selectQuery = `
      SELECT Parking_ID 
      FROM parking 
      WHERE Type_ID = ? AND PStatus_ID = '1' 
      LIMIT 1
    `;

    db.query(selectQuery, [typeId], (err, results) => {
      if (err) {
        return callback(err, null);
      }

      if (results.length > 0) {
        const parkingId = results[0].Parking_ID;

        const updateQuery = `
          UPDATE parking 
          SET PStatus_ID = '3' 
          WHERE Parking_ID = ?
        `;

        db.query(updateQuery, [parkingId], (updateErr) => {
          if (updateErr) {
            return callback(updateErr, null);
          }
          callback(null, parkingId);
        });
      } else {
        callback(null, null);
      }
    });
  },
};

module.exports = Deposit;
