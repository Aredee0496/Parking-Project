import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { Button, Modal, Form, Input, notification, List } from "antd";
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

  useEffect(() => {
    const fetchCustomer = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/customers/${user.id}`);
        form.setFieldsValue({
          Customer_Fname: response.data.Customer_Fname,
          Customer_Lname: response.data.Customer_Lname,
          Customer_Username: response.data.Customer_Username,
          Customer_Password: response.data.Customer_Password,
          Customer_Tel: response.data.Customer_Tel,
        });
      } catch (error) {
        console.error("Error fetching customer data:", error);
      }
    };

    const fetchVehicles = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/cars`);
        setVehicles(response.data.filter(car => car.Customer_ID === user.id));
      } catch (error) {
        console.error("Error fetching vehicles:", error);
      }
    };

    if (user) {
      fetchCustomer();
      fetchVehicles();
    }
  }, [user, form]);

  const fetchReceipts = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/api/receipts`);
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
    }
  };

  const handleEdit = () => {
    setVisible(true);
  };

  const handleVehicleEdit = () => {
    setVehicleVisible(true);
  };

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
      <h1>ตั้งค่า</h1>
      <div>
        {/* <p>iD: {user?.id}</p>
        <p>บทบาท: {user?.role}</p> */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <Button onClick={handleEdit}>แก้ไขข้อมูลส่วนตัว</Button>
          <Button onClick={handleVehicleEdit}>แก้ไขข้อมูลรถ</Button>
          <Button onClick={handleViewReceipts}>ดูใบเสร็จ</Button>
          <Button onClick={handleLogout} danger>ออกจากระบบ</Button>
        </div>
      </div>

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
            <Button type="primary" htmlType="submit">
              อัปเดต
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="แก้ไขข้อมูลรถ"
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
              {editingVehicle ? "อัปเดตข้อมูลรถ" : "เพิ่มข้อมูลรถ"}
            </Button>
          </Form.Item>
        </Form>
        <List
          itemLayout="horizontal"
          dataSource={vehicles}
          renderItem={(vehicle) => (
            <List.Item
              actions={[
                <Button onClick={() => handleEditVehicle(vehicle)}>แก้ไข</Button>,
                <Button danger onClick={() => handleDelete(vehicle.Car_ID)}>ลบ</Button>
              ]}
            >
              <List.Item.Meta
                title={vehicle.RegisterPlateNo}
              />
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
                    <p>ชื่อลูกค้า: {receipt.Customer_Fname} {receipt.Customer_Lname}</p>
                    <p>ทะเบียนรถ: {receipt.RegisterPlateNo}</p>
                    <p>ประเภท: {receipt.Type_name}</p>
                    <p>เช็คอิน: {new Date(receipt.CheckinDateTime).toLocaleString()}</p>
                    <p>เช็คเอาท์: {new Date(receipt.CheckoutDateTime).toLocaleString()}</p>
                    <p>ราคา: {receipt.Price} บาท</p>
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