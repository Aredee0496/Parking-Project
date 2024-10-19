import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Table, Button, Form, Select, Input, notification, Collapse } from 'antd';

const { Option } = Select;
const { Panel } = Collapse;

function ParkingList() {
  const [parkings, setParkings] = useState([]);
  const [error, setError] = useState(null);
  const [types, setTypes] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditPriceForm, setShowEditPriceForm] = useState(false);

  useEffect(() => {
    const fetchParkings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/parkings');
        setParkings(response.data);
      } catch (error) {
        console.error('Error fetching parkings:', error);
        setError('Failed to fetch data. Please try again later.');
      }
    };

    const fetchTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/types');
        setTypes(response.data);
      } catch (error) {
        console.error('Error fetching types:', error);
        setError('Failed to fetch types. Please try again later.');
      }
    };

    fetchParkings();
    fetchTypes();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this parking spot?')) {
      try {
        await axios.delete(`http://localhost:5000/api/parkings/${id}`);
        setParkings(parkings.filter(parking => parking.Parking_ID !== id));
        notification.success({
          message: 'Success',
          description: 'Parking spot deleted successfully!',
        });
      } catch (error) {
        console.error('Error deleting parking:', error);
        notification.error({
          message: 'Error',
          description: 'Failed to delete data. Please try again later.',
        });
      }
    }
  };

  const handleAddParking = async (values) => {
    try {
      const newParkings = [];
      for (let i = 0; i < values.quantity; i++) {
        const response = await axios.post('http://localhost:5000/api/parkings', {
          Type_ID: values.Type_ID,
        });
        newParkings.push(response.data);
      }
      setParkings([...parkings, ...newParkings]);
      window.location.reload();
      notification.success({
        message: 'Success',
        description: 'Parking spots added successfully!',
      });

    } catch (error) {
      console.error('Error adding parking:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to add data. Please try again later.',
      });
    }
  };

  const handleEditPrice = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/types/${values.Type_ID}`, {
        Price_Hour: values.newPriceHour,
        Price_Day: values.newPriceDay,
      });
      setTypes(types.map(type => type.Type_ID === values.Type_ID ? { ...type, Price_Hour: values.newPriceHour, Price_Day: values.newPriceDay } : type));
      window.location.reload();
      notification.success({
        message: 'Success',
        description: 'Prices updated successfully!',
      });
    } catch (error) {
      console.error('Error updating prices:', error);
      notification.error({
        message: 'Error',
        description: 'Failed to update prices. Please try again later.',
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: 'ประเภท',
      dataIndex: 'Type_name',
      key: 'Type_name',
    },
    {
      title: 'ราคา ช.ม.',
      dataIndex: 'Price_Hour',
      key: 'Price_Hour',
    },
    {
      title: 'ราคาวัน',
      dataIndex: 'Price_Day',
      key: 'Price_Day',
    },
    {
      title: 'สถานะ',
      dataIndex: 'PStatus_name',
      key: 'PStatus_name',
    },
    {
      title: '',
      key: 'actions',
      render: (_, parking) => (
        <Button type="default" danger onClick={() => handleDelete(parking.Parking_ID)}>
          ลบ
        </Button>
      ),
    },
  ];

  return (
    <div>
      {error && <p>{error}</p>}

      <Collapse>
        <Panel header="เพิ่มที่จอด" key="1" extra={<Button onClick={() => setShowAddForm(!showAddForm)}>{showAddForm ? 'ซ่อน' : 'แสดง'}</Button>}>
          {showAddForm && (
            <Form onFinish={handleAddParking}>
              <Form.Item name="Type_ID" label="ประเภท" rules={[{ required: true, message: 'Please select a type!' }]}>
                <Select placeholder="เลือกประเภท">
                  {types.map((type) => (
                    <Option key={type.Type_ID} value={type.Type_ID}>
                      {type.Type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="quantity" label="จำนวน" rules={[{ required: true, message: 'Please enter a quantity!' }]}>
                <Input type="number" min={1} defaultValue={1} />
              </Form.Item>
              <Button type="primary" htmlType="submit">ยืนยัน</Button>
            </Form>
          )}
        </Panel>
        <Panel header="แก้ไขราคา" key="2" extra={<Button onClick={() => setShowEditPriceForm(!showEditPriceForm)}>{showEditPriceForm ? 'ซ่อน' : 'แสดง'}</Button>}>
          {showEditPriceForm && (
            <Form onFinish={handleEditPrice}>
              <Form.Item name="Type_ID" label="ประเภท" rules={[{ required: true, message: 'กรุณาเลือกประเภท!' }]}>
                <Select placeholder="เลือกประเภท">
                  {types.map((type) => (
                    <Option key={type.Type_ID} value={type.Type_ID}>
                      {type.Type_name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item name="newPriceHour" label="ราคาต่อ ช.ม." rules={[{ required: true, message: 'กรุณากรอกราคา!' }]}>
                <Input type="number" min={0} />
              </Form.Item>
              <Form.Item name="newPriceDay" label="ราคาต่อวัน" rules={[{ required: true, message: 'กรุณากรอกราคา!' }]}>
                <Input type="number" min={0} />
              </Form.Item>
              <Button type="primary" htmlType="submit">ยืนยัน</Button>
            </Form>
          )}
        </Panel>
      </Collapse>

      <Table dataSource={parkings} columns={columns} rowKey="Parking_ID" pagination={{ pageSize: 10 }} />
    </div>
  );
}

export default ParkingList;
