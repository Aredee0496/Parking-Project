import axios from "axios";
import { Input, Button, Form, notification, Card, Typography } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

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
      const dataToSend = {
        ...values,
        RegisterPlateNo: [values.RegisterPlateNo]
      };
      await axios.post("http://localhost:5000/api/customers/register", dataToSend);
      showNotification("success", "สมัครสมาชิกสำเร็จ");
      form.resetFields();
      navigate('/login');
    } catch (error) {
      console.error("Error registering customer:", error);
      showNotification("error", "ไม่สามารถสมัครสมาชิกได้");
    }
  };

  return (
    <div style={{ padding: 50, backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      <Card style={{ maxWidth: 400, margin: 'auto', borderRadius: 10 }}>
        <Title level={2} style={{ textAlign: 'center', marginBottom: 20 }}>สมัครสมาชิก</Title>
        <Form form={form} onFinish={handleCustomerSubmit}>
          <Form.Item label="ชื่อ" name="Customer_Fname" rules={[{ required: true, message: 'กรุณากรอกชื่อ' }]}>
            <Input placeholder="กรุณากรอกชื่อ" />
          </Form.Item>
          <Form.Item label="นามสกุล" name="Customer_Lname" rules={[{ required: true, message: 'กรุณากรอกนามสกุล' }]}>
            <Input placeholder="กรุณากรอกนามสกุล" />
          </Form.Item>
          <Form.Item label="Username" name="Customer_Username" rules={[{ required: true, message: 'กรุณากรอก username' }]}>
            <Input placeholder="กรุณากรอก username" />
          </Form.Item>
          <Form.Item label="Password" name="Customer_Password" rules={[{ required: true, message: 'กรุณากรอก password' }]}>
            <Input.Password placeholder="กรุณากรอก password" />
          </Form.Item>
          <Form.Item label="เบอร์โทรศัพท์" name="Customer_Tel" rules={[{ required: true, message: 'กรุณากรอกเบอร์โทรศัพท์' }]}>
            <Input placeholder="กรุณากรอกเบอร์โทรศัพท์" />
          </Form.Item>
          <Form.Item label="ทะเบียนรถ" name="RegisterPlateNo" rules={[{ required: true, message: 'กรุณากรอกทะเบียนรถ' }]}>
            <Input placeholder="กรุณากรอกทะเบียนรถ" />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%', marginBottom: 10 }}>
            สมัครสามาชิก
          </Button>
          <Button type="default" onClick={() => navigate(-1)} style={{ width: '100%' }}>
            กลับ
          </Button>
        </Form>
      </Card>
    </div>
  );
};

export default Register;
