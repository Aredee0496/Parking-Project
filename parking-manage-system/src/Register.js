import axios from "axios";
import { Input, Button, Form, notification } from 'antd';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const showNotification = (type, message) => {
    notification[type]({
      message,
      placement: "topRight",
    });
  };

  const handleCustomerSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/customers", values);
      showNotification("success", "Customer registered successfully.");
      form.resetFields(); // Optionally reset the form fields
      navigate('/login'); // Redirect to the login page
    } catch (error) {
      console.error("Error registering customer:", error);
      showNotification("error", "Error registering customer.");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      {/* Register Customer Form */}
      <Form form={form} onFinish={handleCustomerSubmit}>
        <Form.Item label="First Name" name="Customer_Fname" rules={[{ required: true, message: 'Please enter the first name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="Customer_Lname" rules={[{ required: true, message: 'Please enter the last name' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Username" name="Customer_Username" rules={[{ required: true, message: 'Please enter the username' }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Password" name="Customer_Password" rules={[{ required: true, message: 'Please enter the password' }]}>
          <Input.Password />
        </Form.Item>
        <Form.Item label="Telephone" name="Customer_Tel" rules={[{ required: true, message: 'Please enter the telephone number' }]}>
          <Input />
        </Form.Item>
        <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
          Register
        </Button>
      </Form>
    </div>
  );
};

export default Register;