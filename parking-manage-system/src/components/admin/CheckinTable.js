import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Table, Spin, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function CheckinTable() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => {
    const fetchCheckins = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deposits'); 
        const filteredCheckins = response.data.filter(checkin => checkin.DepositStatus_ID === 2);
        setCheckins(filteredCheckins);
      } catch (error) {
        console.error('Error fetching check-ins:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckins();
  }, []);

  const handleCheckout = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/deposits/${id}`, {
        Checkout_DateTime: dayjs().toISOString(),
        Officer_ID: currentUser.id,
        DepositStatus_ID: 3, 
      });

      setCheckins(prev => prev.map(checkin => 
        checkin.Deposit_ID === id ? { ...checkin, DepositStatus_ID: 3 } : checkin
      ));
      message.success('Check-out successful!');
    } catch (error) {
      console.error('Error during check-out:', error);
      message.error('Check-out failed. Please try again.');
    }
  };

  const columns = [
    {
      title: 'Deposit_ID',
      dataIndex: 'Deposit_ID',
      key: 'Deposit_ID',
    },
    {
      title: 'ชื่อลูกค้า',
      render: (text, record) => `${record.Customer_Fname} ${record.Customer_Lname}`,
      key: 'customer',
    },
    {
      title: 'Register Plate No',
      dataIndex: 'RegisterPlateNo', 
      key: 'RegisterPlateNo',
    },
    {
      title: 'Checkin_DateTime',
      render: (text, record) => dayjs(record.Checkin_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkin_DateTime',
    },
    {
      title: 'Parking_ID',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button onClick={() => handleCheckout(record.Deposit_ID, record.Car_ID)} type="primary">
          Check-out
        </Button>
      ),
      key: 'actions',
    },
  ];

  return (
    <div>
      <h1>หน้า Check-in</h1>
      {loading ? (
        <Spin tip="กำลังโหลด..." />
      ) : (
        <Table dataSource={checkins} columns={columns} rowKey="Deposit_ID" />
      )}
    </div>
  );
}

export default CheckinTable;
