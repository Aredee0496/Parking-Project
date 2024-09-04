import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Table, Spin, Button, message, Modal } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function CheckinTable() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
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
      

      // Update Deposit Status
      await axios.put(`http://localhost:5000/api/deposits/${id}`, {
        Checkout_DateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        Officer_ID: currentUser.id,
        DepositStatus_ID: 3, 
      });

      // Fetch Deposit Data to calculate fee
      const depositResponse = await axios.get(`http://localhost:5000/api/deposits/${id}`);
      const deposit = depositResponse.data;

      // Fetch Type Data for pricing
      const typeResponse = await axios.get(`http://localhost:5000/api/types/${deposit.Type_ID}`);
      const type = typeResponse.data;

      // Calculate parking time in hours
      const parkingTime = dayjs(deposit.Checkout_DateTime).diff(dayjs(deposit.Checkin_DateTime), "hour");
console.log("Parking Time:", parkingTime);
      // Calculate fee based on Type_ID
      let parkingFee = 0;
      const fullDays = Math.floor(parkingTime / 24);
      const remainingHours = parkingTime % 24;


      if (deposit.Type_ID === '1') {
        parkingFee = fullDays * type.Price_Day + (remainingHours <= 10 ? remainingHours * type.Price_Hour : type.Price_Day);
      } else if (deposit.Type_ID === '2') {
        parkingFee = fullDays * type.Price_Day + (remainingHours <= 5 ? remainingHours * type.Price_Hour : type.Price_Day);
      }

      // Create Receipt
      const receiptResponse = await axios.post("http://localhost:5000/api/receipts", {
        Deposit_ID: id,
        Parking_Time: `${parkingTime} hours`, 
        Parking_Fee: parkingFee,
      });

      const receipt = receiptResponse.data;

      setReceiptData({
        ...receipt,
        Deposit_ID:deposit.Deposit_ID,
        Customer: `${deposit.Customer_Fname} ${deposit.Customer_Lname}`,
        RegisterPlateNo: deposit.RegisterPlateNo,
        Checkin_DateTime: deposit.Checkin_DateTime,
        Checkout_DateTime: deposit.Checkout_DateTime,
        Type_Name: type.Type_name,
        Parking_ID: deposit.Parking_ID,
        Parking_Time: `${parkingTime} hours`,
        Parking_Fee: parkingFee,
      });
      setReceiptModalVisible(true);

      message.success("Check-out successful!");
    } catch (error) {
      console.error("Error during check-out:", error.response?.data || error.message);
      message.error("Check-out failed. Please try again.");
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
        <Button onClick={() => handleCheckout(record.Deposit_ID)} type="primary">
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

      <Modal
        title="Receipt"
        visible={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={null}
      >
        {receiptData && (
          <div>
             <p><strong>Deposit ID:</strong>{receiptData.Deposit_ID}</p>
        <p><strong>Customer:</strong> {receiptData.Customer}</p>
        <p><strong>Register Plate No:</strong> {receiptData.RegisterPlateNo}</p>
        <p><strong>Check-in Time:</strong> {dayjs(receiptData.Checkin_DateTime).format('DD/MM/YYYY HH:mm')}</p>
        <p><strong>Checkout Time:</strong> {dayjs(receiptData.Checkout_DateTime).format('DD/MM/YYYY HH:mm')}</p>
        <p><strong>Type:</strong> {receiptData.Type_Name}</p>
        <p><strong>Parking ID:</strong> {receiptData.Parking_ID}</p>
        <p><strong>Parking Time:</strong> {receiptData.Parking_Time}</p>
        <p><strong>Parking Fee:</strong> {receiptData.Parking_Fee} THB</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckinTable;
