import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; 
import "./Login.css";

const Login = () => {
  const { setUser } = useAuth(); // เปลี่ยนให้เหมาะสม
  const [username, setUsername] = useState(""); // เปลี่ยนชื่อเป็น username
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      navigate("/verify"); 
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: username, 
        password: password,
      });

      if (response.data.success) {
        const userData = {
          name: response.data.user,
          role: response.data.role
        };

        setUser(userData); 
        localStorage.setItem('jwt', response.data.token);
        navigate("/verify");
      } else {
        setError("Username หรือ Password ไม่ถูกต้อง! กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error("There was an error logging in!", error);
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
    }
  };

  return (
    <div className="main-login">
      <div className="login">
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)} // เปลี่ยนเป็น setUsername
            />
          </div>
          <div>
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit">Login</button>
        </form>
        <div>
          <p>
            หากยังไม่ได้สมัครสมาชิก? <Link to="/register">สมัครสมาชิก</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
