const db = require('../db'); // เชื่อมต่อฐานข้อมูล

const Car = {
  // ฟังก์ชันเพื่อดึงข้อมูลรถยนต์ทั้งหมด
  getAll: (callback) => {
    db.query('SELECT * FROM car', (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // ฟังก์ชันเพื่อดึงข้อมูลรถยนต์ตาม ID
  getById: (id, callback) => {
    db.query('SELECT * FROM car WHERE Car_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results[0]); // ส่งคืนแถวแรกของผลลัพธ์ (ถ้ามี)
    });
  },

  // ฟังก์ชันเพื่อเพิ่มรถยนต์ใหม่
  create: (data, callback) => {
    // ตรวจสอบข้อมูลก่อนใช้งาน
    if (!data || !data.RegisterPlateNo || !data.Customer_ID) {
      return callback(new Error('Missing required car data'), null);
    }
    
    // หา ID ถัดไป
    getNextCarId((err, newId) => {
      if (err) return callback(err, null);
      
      // เพิ่ม ID ใหม่เข้าไปในข้อมูลที่ต้องการแทรก
      const newCarData = { ...data, Car_ID: newId };
      db.query('INSERT INTO car SET ?', newCarData, (err, results) => {
        if (err) {
          console.error('Database error:', err);
          return callback(err, null);
        }
        callback(null, newId); // ส่งคืน ID ใหม่
      });
    });
  },

  // ฟังก์ชันเพื่ออัปเดตข้อมูลรถยนต์
  update: (id, data, callback) => {
    db.query('UPDATE car SET ? WHERE Car_ID = ?', [data, id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  },

  // ฟังก์ชันเพื่อลบข้อมูลรถยนต์ตาม ID
  delete: (id, callback) => {
    db.query('DELETE FROM car WHERE Car_ID = ?', [id], (err, results) => {
      if (err) {
        return callback(err, null);
      }
      callback(null, results);
    });
  }
};

// ฟังก์ชันเพื่อหาหมายเลข ID ถัดไป
const getNextCarId = (callback) => {
  db.query('SELECT MAX(Car_ID) AS maxId FROM car', (err, results) => {
    if (err) return callback(err);

    let newId = 'CA01'; // ค่าเริ่มต้นถ้าไม่มีข้อมูล
    if (results[0].maxId) {
      const currentMaxId = results[0].maxId;
      const currentNumber = parseInt(currentMaxId.substring(2), 10); // ใช้เลขหลัง 'CA'
      if (!isNaN(currentNumber)) {
        newId = `CA${(currentNumber + 1).toString().padStart(2, '0')}`;
      }
    }
    callback(null, newId);
  });
};

module.exports = Car;
