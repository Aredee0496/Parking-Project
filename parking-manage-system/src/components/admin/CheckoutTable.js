import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, message, Input } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function CheckoutTable() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [filteredCheckouts, setFilteredCheckouts] = useState([]);

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deposits');
        const filteredCheckouts = response.data
          .filter(checkout => checkout.DepositStatus_ID === 3)
          .sort((a, b) => new Date(b.Checkout_DateTime) - new Date(a.Checkout_DateTime)); 
        setCheckouts(filteredCheckouts);
        setFilteredCheckouts(filteredCheckouts); // Initialize filtered data
      } catch (error) {
        console.error('Error fetching check-outs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  useEffect(() => {
    const lowerSearchText = searchValue.toLowerCase();
    const filtered = checkouts.filter(checkout =>
      `${checkout.Customer_Fname} ${checkout.Customer_Lname}`.toLowerCase().includes(lowerSearchText)
    );
    setFilteredCheckouts(filtered);
  }, [searchValue, checkouts]);

  const handleViewReceipt = async (id) => {
    try {
      const receiptResponse = await axios.get(`http://localhost:5000/api/receipts/${id}`);
      
      // Fetching the deposit data along with receipt data
      const depositResponse = await axios.get(`http://localhost:5000/api/deposits/${id}`);
      
      // Combine deposit and receipt data
      const receiptData = {
        ...receiptResponse.data,
        Checkin_DateTime: depositResponse.data.Checkin_DateTime,
        Checkout_DateTime: depositResponse.data.Checkout_DateTime
      };
      
      setReceipt(receiptData);
      setReceiptModalVisible(true);
    } catch (error) {
      console.error("Error fetching receipt data:", error.response?.data || error.message);
      message.error("Failed to load receipt data. Please try again.");
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
      title: 'Checkin_DateTime',
      render: (text, record) => dayjs(record.Checkin_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkin_DateTime',
    },
    {
      title: 'Checkout_DateTime',
      render: (text, record) => dayjs(record.Checkout_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkout_DateTime',
    },
    {
      title: 'Parking_ID',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button onClick={() => handleViewReceipt(record.Deposit_ID)} type="primary">
          View Receipt
        </Button>
      ),
      key: 'actions',
    },
  ];

  return (
    <div>
      <Input
        placeholder="ค้นหาข้อมูลลูกค้า"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 8, width: 300, float: 'right' }}
      />
      {loading ? (
        <Spin tip="กำลังโหลด..." />
      ) : (
        <Table dataSource={filteredCheckouts} columns={columns} rowKey="Deposit_ID" />
      )}

      <Modal
        title="Receipt"
        visible={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={null}
      >
        {receipt && (
          <div>
            <p><strong>Receipt ID:</strong> {receipt.Receipt_ID}</p>
            <p><strong>Deposit ID:</strong> {receipt.Deposit_ID}</p>
            <p><strong>Customer:</strong> {receipt.Customer_Fname} {receipt.Customer_Lname}</p>
            <p><strong>Register Plate No:</strong> {receipt.RegisterPlateNo}</p>
            <p><strong>Check-in Time:</strong> {dayjs(receipt.Checkin_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Checkout Time:</strong> {dayjs(receipt.Checkout_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>Type:</strong> {receipt.Type_name}</p>
            <p><strong>Parking ID:</strong> {receipt.Parking_ID}</p>
            <p><strong>Parking Time:</strong> {receipt.Parking_Time}  ชั่วโมง</p>
            <p><strong>Parking Fee:</strong> {receipt.Parking_Fee} บาท</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckoutTable;
