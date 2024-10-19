import axios from "axios";
import { useEffect, useState } from "react";
import { Table, Modal, Input, Button, Form, notification } from "antd";
import { SearchOutlined } from "@ant-design/icons";

const CustomerData = () => {
  const [customers, setCustomers] = useState([]);
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalState, setModalState] = useState({
    customer: { visible: false, data: {} },
    car: { visible: false, customerId: null },
    edit: { visible: false, data: {} },
  });
  const [searchQuery, setSearchQuery] = useState("");

  const fetchData = async () => {
    try {
      const [customersResponse, carsResponse] = await Promise.all([
        axios.get("http://localhost:5000/api/customers"),
        axios.get("http://localhost:5000/api/cars"),
      ]);
      setCustomers(customersResponse.data);
      setCars(carsResponse.data);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const showNotification = (type, message) => {
    notification[type]({
      message,
      placement: "topRight",
    });
  };

  const handleDelete = async (url, id, dataType) => {
      try {
        await axios.delete(`${url}/${id}`);
        showNotification("success", `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} deleted successfully.`);
        fetchData();
      } catch (error) {
        console.error(`Error deleting ${dataType}:`, error);
        showNotification("error", `Error deleting ${dataType}.`);
      }
  };

  const handleModalToggle = (modal, isVisible, data = {}, customerId = null) => {
    setModalState((prevState) => ({
      ...prevState,
      [modal]: { visible: isVisible, data, customerId },
    }));
  };

  const handleCustomerSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/customers", values);
      showNotification("success", "Customer added successfully.");
      handleModalToggle("customer", false);
      fetchData();
    } catch (error) {
      console.error("Error adding customer:", error);
      showNotification("error", "Error adding customer.");
    }
};

  const handleCarSubmit = async (values) => {
    try {
      await axios.post("http://localhost:5000/api/cars", {
        Customer_ID: modalState.car.customerId,
        RegisterPlateNo: values.RegisterPlateNo.split(",").map((plate) => plate.trim()),
      });
      showNotification("success", "Cars added successfully.");
      handleModalToggle("car", false);
      fetchData(); 
    } catch (error) {
      console.error("Error adding cars:", error);
      showNotification("error", "Error adding cars.");
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/customers/${modalState.edit.data.Customer_ID}`, values);
      showNotification("success", "Customer updated successfully.");
      handleModalToggle("edit", false);
      fetchData();
    } catch (error) {
      console.error("Error updating customer:", error);
      showNotification("error", "Error updating customer.");
    }
  };

  const filteredCustomers = customers.filter((customer) =>
    [customer.Customer_Fname, customer.Customer_Lname, customer.Customer_Username].some((field) =>
      field.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div>
      <Input
        placeholder="ค้นหาข้อมูลลูกค้า..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        style={{ marginBottom: 16, width: 300, marginRight: 8 }}
        prefix={<SearchOutlined />}
      />
      <Button
        type="primary"
        onClick={() => handleModalToggle("customer", true)}
        style={{ marginBottom: 16 }}
      >
        เพิ่มลูกค้า
      </Button>

      <Table dataSource={filteredCustomers} rowKey="Customer_ID" loading={loading}>
        <Table.Column title="ID" dataIndex="Customer_ID" />
        <Table.Column title="ชื่อ" dataIndex="Customer_Fname" />
        <Table.Column title="นามสกุล" dataIndex="Customer_Lname" />
        <Table.Column title="ชื่อผู้ใช้" dataIndex="Customer_Username" />
        <Table.Column title="เบอร์โทรศัพท์" dataIndex="Customer_Tel" />
        <Table.Column
          title="เลขทะเบียนรถ"
          render={(text, customer) => (
            <div>
              {cars.filter((car) => car.Customer_ID === customer.Customer_ID).map((car) => (
                <div key={car.Car_ID}>
                  {car.RegisterPlateNo}{" "}
                  <Button danger onClick={() => handleDelete("http://localhost:5000/api/cars", car.Car_ID, "car")}>
                    ลบรถ
                  </Button>
                </div>
              ))}
            </div>
          )}
        />
        <Table.Column
          title=""
          render={(text, customer) => (
            <div>
              <Button type="primary" onClick={() => handleModalToggle("car", true, {}, customer.Customer_ID)} style={{ marginRight: 5 }}>
                เพิ่มรถ
              </Button>
              <Button type="default" onClick={() => handleModalToggle("edit", true, customer)} style={{ marginRight: 5 }}>
                แก้ไข
              </Button>
              <Button danger onClick={() => handleDelete("http://localhost:5000/api/customers", customer.Customer_ID, "customer")}>
                ลบ
              </Button>
            </div>
          )}
        />
      </Table>

      {/* Add Customer Modal */}
      <Modal
        title="เพิ่มลูกค้าใหม่"
        visible={modalState.customer.visible}
        onCancel={() => handleModalToggle("customer", false)}
        footer={null}
      >
        <Form onFinish={handleCustomerSubmit} initialValues={modalState.customer.data}>
          <Form.Item label="ชื่อ" name="Customer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="นามสกุล" name="Customer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="ชื่อผู้ใช้" name="Customer_Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="รหัสผ่าน" name="Customer_Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="เบอร์โทรศัพท์" name="Customer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            ยืนยัน
          </Button>
          <Button onClick={() => handleModalToggle("customer", false)}>ยกเลิก</Button>
        </Form>
      </Modal>

      {/* Add Car Modal */}
      <Modal
        title="เพิ่มรถ"
        visible={modalState.car.visible}
        onCancel={() => handleModalToggle("car", false)}
        footer={null}
      >
        <Form onFinish={handleCarSubmit}>
          <Form.Item label="ทะเบียนรถ" name="RegisterPlateNo" rules={[{ required: true }]}>
            <Input placeholder="กรุณากรองทะเบียนรถ" />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            ยืนยัน
          </Button>
          <Button onClick={() => handleModalToggle("car", false)}>ยกเลิก</Button>
        </Form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        title="แก้ไขข้อมูลลูกค้า"
        visible={modalState.edit.visible}
        onCancel={() => handleModalToggle("edit", false)}
        footer={null}
      >
        <Form onFinish={handleEditSubmit} initialValues={modalState.edit.data}>
          <Form.Item label="ชื่อ" name="Customer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="นามสกุล" name="Customer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="เบอร์โทรศัพท์" name="Customer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            บันทึก
          </Button>
          <Button onClick={() => handleModalToggle("edit", false)}>ยกเลิก</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerData;
