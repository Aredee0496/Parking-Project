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
        setFilteredCheckouts(filteredCheckouts);
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

      const depositResponse = await axios.get(`http://localhost:5000/api/deposits/${id}`);
      
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
      title: 'เลขที่การฝาก',
      dataIndex: 'Deposit_ID',
      key: 'Deposit_ID',
    },
    {
      title: 'ชื่อลูกค้า',
      render: (text, record) => `${record.Customer_Fname} ${record.Customer_Lname}`,
      key: 'customer',
    },
    {
      title: 'วันที่และเวลาเช็คอิน',
      render: (text, record) => dayjs(record.Checkin_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkin_DateTime',
    },
    {
      title: 'วันที่และเวลาเช็คเอาท์',
      render: (text, record) => dayjs(record.Checkout_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkout_DateTime',
    },
    {
      title: 'เลขที่จอด',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: '',
      render: (text, record) => (
        <Button onClick={() => handleViewReceipt(record.Deposit_ID)} type="primary">
          ดูใบเสร็จ
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
        title="ใบเสร็จ"
        visible={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={null}
      >
        {receipt && (
          <div>
            <p><strong>เลขที่ใบเสร็จ:</strong> {receipt.Receipt_ID}</p>
            <p><strong>เลขที่การฝาก:</strong> {receipt.Deposit_ID}</p>
            <p><strong>ชื่อลูกค้า:</strong> {receipt.Customer_Fname} {receipt.Customer_Lname}</p>
            <p><strong>ทะเบียนรถ:</strong> {receipt.RegisterPlateNo}</p>
            <p><strong>ประเภท:</strong> {receipt.Type_name}</p>
            <p><strong>เลขที่จอด:</strong> {receipt.Parking_ID}</p>
            <p><strong>วันที่และเวลาเช็คอิน:</strong> {dayjs(receipt.Checkin_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>วันที่และเวลาเช็คเอาท์:</strong> {dayjs(receipt.Checkout_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>เวลาจอด:</strong> {receipt.Parking_Time}  ชั่วโมง</p>
            <p><strong>ค่าที่จอด:</strong> {receipt.Parking_Fee} บาท</p>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckoutTable;
