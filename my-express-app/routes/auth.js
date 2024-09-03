const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth");


// เส้นทาง POST สำหรับการเข้าสู่ระบบ
router.post("/login", authController.login);
router.get("/verify-token", authController.verifyToken, (req, res) => {
    res
      .status(200)
      .json({ success: true, message: "Token is valid!", user: req.user });
  });



module.exports = router;

