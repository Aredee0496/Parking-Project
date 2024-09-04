const db = require('../db');
const crypto = require('crypto');

function generateRandomId() {
    return crypto.randomBytes(4).toString('hex'); // สร้าง ID แบบสุ่มความยาว 8 ตัวอักษร (4 ไบต์)
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

  getById: (id, callback) => {
    db.query('SELECT * FROM receipt WHERE Receipt_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]);
    });
  },
  
  create: (data, callback) => {
    // สร้าง ID แบบสุ่ม
    const randomId = generateRandomId();
    // เพิ่ม randomId ลงใน data
    data.Receipt_ID = randomId;

    // เริ่มการทำงานของ query
    db.query('INSERT INTO receipt SET ?', data, (err, results) => {
        if (err) {
            return callback(err, null);
        }

        const depositId = data.Deposit_ID;

        // ดึง Parking_ID จากตาราง deposit โดยใช้ Deposit_ID
        db.query(
            "SELECT Parking_ID FROM deposit WHERE Deposit_ID = ?",
            [depositId],
            (selectErr, selectResults) => {
                if (selectErr) {
                    return callback(selectErr, null);
                }

                const parkingId = selectResults[0].Parking_ID;

                // อัปเดตสถานะในตาราง parking
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
