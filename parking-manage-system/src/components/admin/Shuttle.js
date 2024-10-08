import axios from 'axios';
import { useEffect, useState } from 'react';
import { Table, Spin, Alert, Select, notification } from 'antd';

const { Option } = Select;

const CallshuttleData = () => {
  const [callshuttles, setCallshuttles] = useState([]);
  const [confirmedShuttles, setConfirmedShuttles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shuttleOptions, setShuttleOptions] = useState([]); // For shuttle ID options

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:5000/api/callshuttles');
      setCallshuttles(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError('เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง');
    } finally {
      setLoading(false);
    }
  };

  const fetchShuttleOptions = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/shuttles'); // Adjust API endpoint for shuttle options
      setShuttleOptions(response.data);
    } catch (error) {
      console.error('Error fetching shuttle options:', error);
    }
  };

  useEffect(() => {
    fetchData();
    fetchShuttleOptions(); // Fetch shuttle options when component mounts
  }, []);

  const handleConfirm = async (id, selectedShuttleID) => {
    if (selectedShuttleID) {
      try {
        await axios.put(`http://localhost:5000/api/callshuttles/${id}`, { Shuttle_ID: selectedShuttleID });
        
        // Show success notification
        notification.success({
          message: 'สำเร็จ',
          description: 'การอัปเดตสำเร็จ',
        });

        const confirmedShuttle = callshuttles.find(shuttle => shuttle.CallShuttle_ID === id);
        if (confirmedShuttle) {
          setConfirmedShuttles(prev => [...prev, { ...confirmedShuttle, Shuttle_ID: selectedShuttleID }]);
          setCallshuttles(prev => prev.filter(shuttle => shuttle.CallShuttle_ID !== id));
        }

        fetchData();
      } catch (error) {
        console.error('Error updating data:', error);
        notification.error({
          message: 'เกิดข้อผิดพลาด',
          description: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูล กรุณาลองใหม่อีกครั้ง',
        });
      }
    } else {
      notification.warning({
        message: 'คำเตือน',
        description: 'ต้องเลือก Shuttle ID',
      });
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'CallShuttle_ID',
      key: 'id',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'Customer_Fname',
      key: 'fname',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'Customer_Lname',
      key: 'lname',
    },
    {
      title: 'เลขที่จอด',
      dataIndex: 'Parking_ID',
      key: 'parkingId',
    },
    {
      title: 'จำนวนคน',
      dataIndex: 'People',
      key: 'people',
    },
    {
      title: 'สถานะ',
      dataIndex: 'CS_Status_name',
      key: 'status',
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Select 
          placeholder="เลือก Shuttle ID" 
          style={{ width: 120, marginRight: 8 }}
          onChange={(value) => handleConfirm(record.CallShuttle_ID, value)} 
        >
          {shuttleOptions.map(shuttle => (
            <Option key={shuttle.Shuttle_ID} value={shuttle.Shuttle_ID}>
              {shuttle.Shuttle_ID}
            </Option>
          ))}
        </Select>
      ),
    },
  ];

  const filteredCallshuttles = callshuttles.filter(shuttle => shuttle.CS_Status_name === 'เรียกรถ');

  const confirmedColumns = [
    {
      title: 'ID',
      dataIndex: 'CallShuttle_ID',
      key: 'id',
    },
    {
      title: 'ชื่อ',
      dataIndex: 'Customer_Fname',
      key: 'fname',
    },
    {
      title: 'นามสกุล',
      dataIndex: 'Customer_Lname',
      key: 'lname',
    },
    {
      title: 'เลขที่จอด',
      dataIndex: 'Parking_ID',
      key: 'parkingId',
    },
    {
      title: 'จำนวนคน',
      dataIndex: 'People',
      key: 'people',
    },
    {
      title: 'เลขรถรับส่ง',
      dataIndex: 'Shuttle_ID',
      key: 'shuttleId',
    },
  ];

  if (loading) return <Spin tip="กำลังโหลด..." />;
  if (error) return <Alert message={error} type="error" showIcon />;

  return (
    <div className="table-container">
      <Table
        columns={columns}
        dataSource={filteredCallshuttles}
        rowKey="CallShuttle_ID"
      />

      <h3>รายการที่สำเร็จแล้ว</h3>
      <Table
        columns={confirmedColumns}
        dataSource={confirmedShuttles}
        rowKey="CallShuttle_ID"
      />
    </div>
  );
};

export default CallshuttleData;
