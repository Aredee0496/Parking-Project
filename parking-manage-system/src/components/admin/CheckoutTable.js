import React, { useEffect, useState } from 'react';
import { Table, Spin, Button, Modal, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function CheckoutTable() {
  const [checkouts, setCheckouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receipt, setReceipt] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);

  useEffect(() => {
    const fetchCheckouts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deposits');
        const filteredCheckouts = response.data.filter(checkout => checkout.DepositStatus_ID === 3);
        setCheckouts(filteredCheckouts);
      } catch (error) {
        console.error('Error fetching check-outs:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckouts();
  }, []);

  const handleViewReceipt = async (id) => {
    try {
      // Fetch the receipt data directly from the server
      const receiptResponse = await axios.get(`http://localhost:5000/api/receipts/${id}`);
      setReceipt(receiptResponse.data);
      console.log("re",receiptResponse.data)
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
      {loading ? (
        <Spin tip="กำลังโหลด..." />
      ) : (
        <Table dataSource={checkouts} columns={columns} rowKey="Deposit_ID" />
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
            <p><strong>Parking Time:</strong> {receipt.Parking_Time}</p>
            <p><strong>Parking Fee:</strong> {receipt.Parking_Fee} THB</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckoutTable;
