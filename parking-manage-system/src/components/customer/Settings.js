import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Modal, Form, Input, notification, List, Card, Spin } from "antd";
import { EditOutlined, DeleteOutlined, LogoutOutlined, PlusOutlined, EyeOutlined } from "@ant-design/icons";
import axios from "axios";

function Settings() {
  const { user, setUser } = useAuth();
  const [visible, setVisible] = useState(false);
  const [vehicleVisible, setVehicleVisible] = useState(false);
  const [receiptsVisible, setReceiptsVisible] = useState(false);
  const [form] = Form.useForm();
  const [vehicles, setVehicles] = useState([]);
  const [vehicleForm] = Form.useForm();
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state for data fetching

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [customerResponse, vehiclesResponse] = await Promise.all([
          axios.get(`http://localhost:5000/api/customers/${user.id}`),
          axios.get(`http://localhost:5000/api/cars`)
        ]);
        form.setFieldsValue({
          Customer_Fname: customerResponse.data.Customer_Fname,
          Customer_Lname: customerResponse.data.Customer_Lname,
          Customer_Username: customerResponse.data.Customer_Username,
          Customer_Password: customerResponse.data.Customer_Password,
          Customer_Tel: customerResponse.data.Customer_Tel,
        });
        setVehicles(vehiclesResponse.data.filter(car => car.Customer_ID === user.id));
      } catch (error) {
        console.error("Error fetching data:", error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถโหลดข้อมูลได้",
        });
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, form]);

  const fetchReceipts = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`http://localhost:5000/api/receipts/all`);
      const uniqueReceipts = response.data.filter(receipt => receipt.Customer_ID === user.id);
      const seenReceiptIds = new Set();
      const filteredReceipts = uniqueReceipts.filter(receipt => {
        if (seenReceiptIds.has(receipt.Receipt_ID)) {
          return false;
        }
        seenReceiptIds.add(receipt.Receipt_ID);
        return true;
      });
      setReceipts(filteredReceipts);
    } catch (error) {
      console.error("Error fetching receipts:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถโหลดใบเสร็จได้",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => setVisible(true);
  const handleVehicleEdit = () => setVehicleVisible(true);
  const handleCancel = () => {
    setVisible(false);
    setVehicleVisible(false);
    setReceiptsVisible(false);
    vehicleForm.resetFields();
    setEditingVehicle(null);
  };

  const handleUpdate = async (values) => {
    const updatedCustomer = {
      Customer_Fname: values.Customer_Fname,
      Customer_Lname: values.Customer_Lname,
      Customer_Username: values.Customer_Username,
      Customer_Password: values.Customer_Password,
      Customer_Tel: values.Customer_Tel,
    };

    try {
      await axios.put(`http://localhost:5000/api/customers/${user.id}`, updatedCustomer);
      notification.success({
        message: "อัปเดตข้อมูลสำเร็จ",
        description: "ข้อมูลส่วนตัวของคุณได้รับการอัปเดตแล้ว",
      });
      setVisible(false);
    } catch (error) {
      console.error("Error updating customer:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลได้",
      });
    }
  };

  const handleDelete = async (carId) => {
    const confirmDelete = window.confirm("คุณแน่ใจว่าต้องการลบข้อมูลรถนี้หรือไม่?");
    if (confirmDelete) {
      try {
        await axios.delete(`http://localhost:5000/api/cars/${carId}`);
        setVehicles(vehicles.filter(vehicle => vehicle.Car_ID !== carId));
        notification.success({
          message: "ลบข้อมูลสำเร็จ",
          description: "ข้อมูลรถยนต์ถูกลบแล้ว",
        });
      } catch (error) {
        console.error("Error deleting vehicle:", error);
        notification.error({
          message: "เกิดข้อผิดพลาด",
          description: "ไม่สามารถลบข้อมูลรถได้",
        });
      }
    }
  };

  const handleEditVehicle = (vehicle) => {
    setEditingVehicle(vehicle);
    vehicleForm.setFieldsValue({ RegisterPlateNo: vehicle.RegisterPlateNo });
  };

  const handleAddVehicle = async (values) => {
    const newVehicle = {
      Customer_ID: user.id,
      RegisterPlateNo: values.RegisterPlateNo,
    };

    try {
      await axios.post(`http://localhost:5000/api/cars`, newVehicle);
      notification.success({
        message: "เพิ่มรถสำเร็จ",
        description: "ข้อมูลรถยนต์ถูกเพิ่มแล้ว",
      });
      vehicleForm.resetFields();
      setVehicleVisible(false);
      const response = await axios.get(`http://localhost:5000/api/cars`);
      setVehicles(response.data.filter(car => car.Customer_ID === user.id));
    } catch (error) {
      console.error("Error adding vehicle:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถเพิ่มข้อมูลรถได้",
      });
    }
  };

  const handleUpdateVehicle = async (values) => {
    const updatedVehicle = {
      RegisterPlateNo: values.RegisterPlateNo,
    };

    try {
      await axios.put(`http://localhost:5000/api/cars/${editingVehicle.Car_ID}`, updatedVehicle);
      notification.success({
        message: "อัปเดตข้อมูลรถสำเร็จ",
        description: "ข้อมูลรถยนต์ถูกอัปเดตแล้ว",
      });
      vehicleForm.resetFields();
      setVehicleVisible(false);
      const response = await axios.get(`http://localhost:5000/api/cars`);
      setVehicles(response.data.filter(car => car.Customer_ID === user.id));
    } catch (error) {
      console.error("Error updating vehicle:", error);
      notification.error({
        message: "เกิดข้อผิดพลาด",
        description: "ไม่สามารถอัปเดตข้อมูลรถได้",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('jwt'); 
    setUser(null);
    notification.success({
      message: "ออกจากระบบสำเร็จ",
      description: "คุณได้ออกจากระบบแล้ว",
    });
  };

  const handleViewReceipts = async () => {
    await fetchReceipts();
    setReceiptsVisible(true);
  };

  return (
    <div>
      <h1 className="header">ตั้งค่า</h1>
      {loading ? (
              <Spin size="large" />
            ) : (
              <Card>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={handleEdit}
                    style={{ height: '100px', fontSize: '16px' }} // เปลี่ยนความสูงที่ต้องการ
                  >
                    แก้ไขข้อมูลส่วนตัว
                  </Button>
                  <Button
                    icon={<PlusOutlined />}
                    onClick={handleVehicleEdit}
                    style={{ height: '100px' , fontSize: '16px'}} // เปลี่ยนความสูงที่ต้องการ
                  >
                    แก้ไขข้อมูลรถ
                  </Button>
                  <Button
                    icon={<EyeOutlined />}
                    onClick={handleViewReceipts}
                    style={{ height: '100px', fontSize: '16px' }} // เปลี่ยนความสูงที่ต้องการ
                  >
                    ดูใบเสร็จ
                  </Button>
                  <Button
                    icon={<LogoutOutlined />}
                    danger
                    onClick={handleLogout}
                    style={{ height: '100px', fontSize: '16px' }} // เปลี่ยนความสูงที่ต้องการ
                  >
                    ออกจากระบบ
                  </Button>
                </div>
              </Card>
            )}


      <Modal
        title="แก้ไขข้อมูลส่วนตัว"
        visible={visible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleUpdate}>
          <Form.Item
            label="ชื่อ"
            name="Customer_Fname"
            rules={[{ required: true, message: "กรุณากรอกชื่อ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="นามสกุล"
            name="Customer_Lname"
            rules={[{ required: true, message: "กรุณากรอกนามสกุล!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="ชื่อผู้ใช้"
            name="Customer_Username"
            rules={[{ required: true, message: "กรุณากรอกชื่อผู้ใช้!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="รหัสผ่าน"
            name="Customer_Password"
            rules={[{ required: true, message: "กรุณากรอกรหัสผ่าน!" }]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="เบอร์โทรศัพท์"
            name="Customer_Tel"
            rules={[{ required: true, message: "กรุณากรอกเบอร์โทรศัพท์!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">บันทึก</Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="ข้อมูลรถ"
        visible={vehicleVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={vehicleForm} onFinish={editingVehicle ? handleUpdateVehicle : handleAddVehicle}>
          <Form.Item
            label="ทะเบียนรถ"
            name="RegisterPlateNo"
            rules={[{ required: true, message: "กรุณากรอกทะเบียนรถ!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {editingVehicle ? "อัปเดต" : "เพิ่ม"}
            </Button>
          </Form.Item>
        </Form>

        <List
          bordered
          dataSource={vehicles}
          renderItem={item => (
            <List.Item
              actions={[
                <Button onClick={() => handleEditVehicle(item)} icon={<EditOutlined />} />,
                <Button onClick={() => handleDelete(item.Car_ID)} icon={<DeleteOutlined />} danger />
              ]}
            >
              {item.RegisterPlateNo}
            </List.Item>
          )}
        />
      </Modal>

      <Modal
    title="ใบเสร็จ"
    visible={receiptsVisible}
    onCancel={handleCancel}
    footer={null}
>
    <List
        itemLayout="horizontal"
        dataSource={receipts}
        renderItem={(receipt) => (
            <List.Item>
                <List.Item.Meta
                    title={`ใบเสร็จที่: ${receipt.Receipt_ID}`}
                    description={
                        <div>
                            <p>Deposit ID: {receipt.Deposit_ID}</p>
                            <p>ชื่อลูกค้า: {receipt.Customer_Fname} {receipt.Customer_Lname}</p>
                            <p>ทะเบียนรถ: {receipt.RegisterPlateNo}</p>
                            <p>ประเภท: {receipt.Type_name}</p>
                            <p>Parking ID: {receipt.Parking_ID}</p>
                            <p>เวลาเช็คอิน: {new Date(receipt.Checkin_DateTime).toLocaleString()}</p>
                            <p>เวลาเช็คเอาท์: {new Date(receipt.Checkout_DateTime).toLocaleString()}</p>
                            <p>เวลาจอด: {receipt.Parking_Time} ชั่วโมง</p>
                            <p>ค่าจอด: {receipt.Parking_Fee} บาท</p>
                        </div>
                    }
                />
            </List.Item>
        )}
    />
</Modal>
    </div>
  );
}

export default Settings;
