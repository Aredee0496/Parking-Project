const db = require("../db"); 
const jwt = require("jsonwebtoken"); 
const secretKey = "your_secret_key"; 

const login = (req, res) => {
  const { username, password } = req.body;

  // ตรวจสอบในตาราง officer
  const officerQuery = "SELECT * FROM officer WHERE Officer_Username = ?";
  db.query(officerQuery, [username], (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "ข้อผิดพลาดในการทำงานกับฐานข้อมูล" });
    }

    if (results.length > 0) {
      const officer = results[0];
      // ตรวจสอบรหัสผ่านที่ตรงตัว
      if (password === officer.Officer_Password) {
        const token = jwt.sign(officer, secretKey, {
          expiresIn: "1h",
        });
        return res.json({
          success: true,
          token: token,
          role: "employee",
          user: officer,
        });
      } else {
        return res.json({
          success: false,
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    }

    // ตรวจสอบในตาราง customer
    const customerQuery = "SELECT * FROM customer WHERE Customer_Username = ?";
    db.query(customerQuery, [username], (err, results) => {
      if (err) {
        return res
          .status(500)
          .json({
            success: false,
            message: "ข้อผิดพลาดในการทำงานกับฐานข้อมูล",
          });
      }

      if (results.length > 0) {
        const customer = results[0];
        // ตรวจสอบรหัสผ่านที่ตรงตัว
        if (password === customer.Customer_Password) {
          const token = jwt.sign(customer ,
            secretKey,   { expiresIn: "1h" }
          );      
              //  const token = jwt.sign(officer, secretKey, {
            //   expiresIn: "1h",
            // });
          return res.json({
            success: true,
            token: token,
            role: "customer",
            user: customer,
          });
        } else {
          return res.json({
            success: false,
            message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
          });
        }
      } else {
        return res.json({
          success: false,
          message: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
        });
      }
    });
  });
};

const verifyToken = (req, res, next) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res
      .status(403)
      .json({ success: false, message: "No token provided." });
  }

  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res
        .status(500)
        .json({ success: false, message: "Failed to authenticate token." });
    }


    req.user = decoded;
    console.log(req.user)
    next();
  });
};


module.exports = {
  login,
  verifyToken
};
