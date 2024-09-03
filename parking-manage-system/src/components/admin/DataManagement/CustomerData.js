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

  useEffect(() => {
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
    fetchData();
  }, []);

  const showNotification = (type, message) => {
    notification[type]({
      message,
      placement: "topRight",
    });
  };

  const handleDelete = async (url, id, dataType) => {
    if (window.confirm(`Are you sure you want to delete this ${dataType}?`)) {
      try {
        await axios.delete(`${url}/${id}`);
        if (dataType === "customer") {
          setCustomers((prev) => prev.filter((customer) => customer.Customer_ID !== id));
          setCars((prev) => prev.filter((car) => car.Customer_ID !== id));
        } else {
          setCars((prev) => prev.filter((car) => car.Car_ID !== id));
        }
        showNotification("success", `${dataType.charAt(0).toUpperCase() + dataType.slice(1)} deleted successfully.`);
      } catch (error) {
        console.error(`Error deleting ${dataType}:`, error);
        showNotification("error", `Error deleting ${dataType}.`);
      }
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
      const response = await axios.post("http://localhost:5000/api/customers", values);
      setCustomers((prev) => [...prev, { ...values, Customer_ID: response.data.Customer_ID }]);
      handleModalToggle("customer", false);
      showNotification("success", "Customer added successfully.");
    } catch (error) {
      console.error("Error adding customer:", error);
      showNotification("error", "Error adding customer.");
    }
  };

  const handleCarSubmit = async (values) => {
    console.log("Customer ID:", modalState.car.customerId);
    console.log("Register Plate No:", values.RegisterPlateNo.split(",").map((plate) => plate.trim()));
  
    try {
      await axios.post("http://localhost:5000/api/cars", {
        Customer_ID: modalState.car.customerId,
        RegisterPlateNo: values.RegisterPlateNo.split(",").map((plate) => plate.trim()),
      });
      handleModalToggle("car", false);
      showNotification("success", "Cars added successfully.");
    } catch (error) {
      console.error("Error adding cars:", error);
      showNotification("error", "Error adding cars.");
    }
  };
  

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/customers/${modalState.edit.data.Customer_ID}`, values);
      setCustomers((prev) => prev.map((customer) => (customer.Customer_ID === modalState.edit.data.Customer_ID ? { ...customer, ...values } : customer)));
      handleModalToggle("edit", false);
      showNotification("success", "Customer updated successfully.");
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
        placeholder="Search customers..."
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
        Add Customer
      </Button>

      <Table dataSource={filteredCustomers} rowKey="Customer_ID" loading={loading}>
        <Table.Column title="ID" dataIndex="Customer_ID" />
        <Table.Column title="First Name" dataIndex="Customer_Fname" />
        <Table.Column title="Last Name" dataIndex="Customer_Lname" />
        <Table.Column title="Username" dataIndex="Customer_Username" />
        <Table.Column title="Telephone" dataIndex="Customer_Tel" />
        <Table.Column
          title="Register Plate Numbers"
          render={(text, customer) => (
            <div>
              {cars.filter((car) => car.Customer_ID === customer.Customer_ID).map((car) => (
                <div key={car.Car_ID}>
                  {car.RegisterPlateNo}{" "}
                  <Button danger onClick={() => handleDelete("http://localhost:5000/api/cars", car.Car_ID, "car")}>
                    Delete
                  </Button>
                </div>
              ))}
            </div>
          )}
        />
        <Table.Column
          title="Actions"
          render={(text, customer) => (
            <div>
              <Button type="primary" onClick={() => handleModalToggle("car", true, {}, customer.Customer_ID)} style={{ marginRight: 5 }}>
                Add Cars
              </Button>
              <Button type="default" onClick={() => handleModalToggle("edit", true, customer)} style={{ marginRight: 5 }}>
                Edit
              </Button>
              <Button danger onClick={() => handleDelete("http://localhost:5000/api/customers", customer.Customer_ID, "customer")}>
                Delete
              </Button>
            </div>
          )}
        />
      </Table>

      {/* Add Customer Modal */}
      <Modal
        title="Add New Customer"
        visible={modalState.customer.visible}
        onCancel={() => handleModalToggle("customer", false)}
        footer={null}
      >
        <Form onFinish={handleCustomerSubmit} initialValues={modalState.customer.data}>
          <Form.Item label="First Name" name="Customer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="Customer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="Customer_Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="Customer_Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Telephone" name="Customer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add
          </Button>
          <Button onClick={() => handleModalToggle("customer", false)}>Cancel</Button>
        </Form>
      </Modal>

      {/* Add Car Modal */}
      <Modal
        title="Add Cars"
        visible={modalState.car.visible}
        onCancel={() => handleModalToggle("car", false)}
        footer={null}
      >
        <Form onFinish={handleCarSubmit}>
          <Form.Item label="Register Plate Number(s)" name="RegisterPlateNo" rules={[{ required: true }]}>
            <Input placeholder="Separate multiple plates with commas" />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Add
          </Button>
          <Button onClick={() => handleModalToggle("car", false)}>Cancel</Button>
        </Form>
      </Modal>

      {/* Edit Customer Modal */}
      <Modal
        title="Edit Customer"
        visible={modalState.edit.visible}
        onCancel={() => handleModalToggle("edit", false)}
        footer={null}
      >
        <Form onFinish={handleEditSubmit} initialValues={modalState.edit.data}>
          <Form.Item label="First Name" name="Customer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="Customer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="Customer_Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Telephone" name="Customer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" style={{ marginRight: 8 }}>
            Save
          </Button>
          <Button onClick={() => handleModalToggle("edit", false)}>Cancel</Button>
        </Form>
      </Modal>
    </div>
  );
};

export default CustomerData;
