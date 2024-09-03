import axios from 'axios';
import { useEffect, useState } from 'react';
import { Button, Modal, Table, Input, Select, Form, notification } from 'antd';

const { Option } = Select;

const EmployeeData = () => {
  const [officers, setOfficers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editOfficer, setEditOfficer] = useState(null);

  useEffect(() => {
    const fetchOfficers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/officers');
        setOfficers(response.data);
      } catch (error) {
        console.error('Error fetching officers:', error);
        notification.error({ message: 'Error fetching officers' });
      } finally {
        setLoading(false);
      }
    };
    fetchOfficers();
  }, []);

  const handleAddSubmit = async (values) => {
    try {
      await axios.post('http://localhost:5000/api/officers', values);
      const response = await axios.get('http://localhost:5000/api/officers');
      setOfficers(response.data);
      setShowAddModal(false);
      notification.success({ message: 'Officer added successfully' });
    } catch (error) {
      console.error('Error adding officer:', error);
      notification.error({ message: 'Error adding officer' });
    }
  };

  const handleEditSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/officers/${editOfficer.Officer_ID}`, values);
      setOfficers(prevOfficers => 
        prevOfficers.map(officer => 
          officer.Officer_ID === editOfficer.Officer_ID ? { ...officer, ...values } : officer
        )
      );
      setShowEditModal(false);
      setEditOfficer(null);
      notification.success({ message: 'Officer updated successfully' });
    } catch (error) {
      console.error('Error updating officer:', error);
      notification.error({ message: 'Error updating officer' });
    }
  };

  const handleDelete = async (officerId) => {
    try {
      await axios.delete(`http://localhost:5000/api/officers/${officerId}`);
      setOfficers(prevOfficers => prevOfficers.filter(officer => officer.Officer_ID !== officerId));
      notification.success({ message: 'Officer deleted successfully' });
    } catch (error) {
      console.error('Error deleting officer:', error);
      notification.error({ message: 'Error deleting officer' });
    }
  };

  const openEditModal = (officer) => {
    setEditOfficer(officer);
    setShowEditModal(true);
  };

  const columns = [
    { title: 'ID', dataIndex: 'Officer_ID', key: 'Officer_ID' },
    { title: 'First Name', dataIndex: 'Officer_Fname', key: 'Officer_Fname' },
    { title: 'Last Name', dataIndex: 'Officer_Lname', key: 'Officer_Lname' },
    { title: 'Username', dataIndex: 'Officer_Username', key: 'Officer_Username' },
    { title: 'Telephone', dataIndex: 'Officer_Tel', key: 'Officer_Tel' },
    { title: 'Role', dataIndex: 'Role', key: 'Role' }, 
    {
      title: 'Actions',
      key: 'actions',
      render: (text, officer) => (
        <>
          <Button onClick={() => openEditModal(officer)} style={{ marginRight: 5 }}>Edit</Button>
          <Button danger onClick={() => handleDelete(officer.Officer_ID)}>Delete</Button>
        </>
      ),
    },
  ];

  return (
    <div>
      <Button type="primary" onClick={() => setShowAddModal(true)}>
        Add Officer
      </Button>
      <Modal
        title="Add Officer"
        visible={showAddModal}
        onCancel={() => setShowAddModal(false)}
        footer={null}
      >
        <Form onFinish={handleAddSubmit} layout="vertical">
          <Form.Item label="First Name" name="Officer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="Officer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="Officer_Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="Officer_Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Telephone" name="Officer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="Role" rules={[{ required: true }]}> 
            <Select>
              <Option value="employee">Employee</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Officer"
        visible={showEditModal}
        onCancel={() => setShowEditModal(false)}
        footer={null}
      >
        <Form initialValues={editOfficer} onFinish={handleEditSubmit} layout="vertical">
          <Form.Item label="ID" name="Officer_ID" rules={[{ required: true }]}>
            <Input disabled />
          </Form.Item>
          <Form.Item label="First Name" name="Officer_Fname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Last Name" name="Officer_Lname" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="Officer_Username" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Password" name="Officer_Password" rules={[{ required: true }]}>
            <Input.Password />
          </Form.Item>
          <Form.Item label="Telephone" name="Officer_Tel" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item label="Role" name="Role" rules={[{ required: true }]}> 
            <Select>
              <Option value="employee">Employee</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">Submit</Button>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        dataSource={officers}
        columns={columns}
        loading={loading}
        rowKey="Officer_ID"
      />
    </div>
  );
};

export default EmployeeData;
