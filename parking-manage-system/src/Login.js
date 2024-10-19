import React, { useState, useEffect } from "react";
import { useAuth } from "./context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import axios from 'axios'; 
import { Form, Input, Button, Card, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;

const Login = () => {
  const { setUser } = useAuth(); 
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedToken = localStorage.getItem('jwt');
    if (storedToken) {
      navigate("/verify"); 
    }
  }, [navigate]);

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post("http://localhost:5000/api/login", {
        username: values.username, 
        password: values.password,
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
    <div className="main-login" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh', background: '#f0f2f5' }}>
      <Card
        style={{ width: 350, textAlign: 'center', padding: '20px' }}
        cover={
          <img
            alt="logo"
            src="LOGO.png"
            style={{ width: '150px', margin: '0 auto', paddingTop: '20px' }}
          />
        }
      >
        <Title level={3}>เข้าสู่ระบบ</Title>
        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={handleSubmit}
        >
          <Form.Item
            name="username"
            rules={[{ required: true, message: 'กรุณากรอก Username!' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'กรุณากรอก Password!' }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          {error && <Text type="danger">{error}</Text>}

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              เข้าสู่ระบบ
            </Button>
          </Form.Item>
        </Form>

        <div>
          <Text>หากยังไม่ได้สมัครสมาชิก? <Link to="/register">สมัครสมาชิก</Link></Text>
        </div>
      </Card>
    </div>
  );
};

export default Login;
