import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Table, Spin, Button, message, Modal, Input } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function CheckinTable() {
  const [checkins, setCheckins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [receiptData, setReceiptData] = useState(null);
  const [receiptModalVisible, setReceiptModalVisible] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const { user: currentUser } = useAuth();

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

  useEffect(() => {
    fetchCheckins();
  }, []);

  const handleCheckout = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/deposits/${id}`, {
        Checkout_DateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        Officer_ID: currentUser.id,
        DepositStatus_ID: 3, 
      });

      const depositResponse = await axios.get(`http://localhost:5000/api/deposits/${id}`);
      const deposit = depositResponse.data;

      const typeResponse = await axios.get(`http://localhost:5000/api/types/${deposit.Type_ID}`);
      const type = typeResponse.data;

      const parkingTime = Math.max(dayjs(deposit.Checkout_DateTime).diff(dayjs(deposit.Checkin_DateTime), "hour"), 1);
      console.log("Parking Time:", parkingTime);
      
      let parkingFee = 0;
      const fullDays = Math.floor(parkingTime / 24);
      const remainingHours = parkingTime % 24;

      if (deposit.Type_ID === '1') {
        parkingFee = fullDays * type.Price_Day + (remainingHours <= 10 ? remainingHours * type.Price_Hour : type.Price_Day);
      } else if (deposit.Type_ID === '2') {
        parkingFee = fullDays * type.Price_Day + (remainingHours <= 5 ? remainingHours * type.Price_Hour : type.Price_Day);
      }

      const receiptResponse = await axios.post("http://localhost:5000/api/receipts", {
        Deposit_ID: id,
        Receipt_DateTime: dayjs().format('YYYY-MM-DDTHH:mm:ss'),
        Parking_Time: parkingTime, 
        Parking_Fee: parkingFee,
      });

      const receipt = receiptResponse.data;

      setReceiptData({
        ...receipt,
        Deposit_ID: deposit.Deposit_ID,
        Customer: `${deposit.Customer_Fname} ${deposit.Customer_Lname}`,
        RegisterPlateNo: deposit.RegisterPlateNo,
        Checkin_DateTime: deposit.Checkin_DateTime,
        Checkout_DateTime: deposit.Checkout_DateTime,
        Type_Name: type.Type_name,
        Parking_ID: deposit.Parking_ID,
        Parking_Time: parkingTime,
        Parking_Fee: parkingFee,
      });

      await axios.delete(`http://localhost:5000/api/callshuttles/${id}`);

      await fetchCheckins();

      setReceiptModalVisible(true);

      message.success("Check-out successful!");
    } catch (error) {
      console.error("Error during check-out:", error.response?.data || error.message);
      message.error("Check-out failed. Please try again.");
    }
  };

  const filteredCheckins = checkins.filter(checkin => {
    const fullName = `${checkin.Customer_Fname} ${checkin.Customer_Lname}`;
    return fullName.toLowerCase().includes(searchValue.toLowerCase());
  });

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
      title: 'ทะเบียนรถ',
      dataIndex: 'RegisterPlateNo', 
      key: 'RegisterPlateNo',
    },
    {
      title: 'วันที่และเวลาเช็คอิน',
      render: (text, record) => dayjs(record.Checkin_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Checkin_DateTime',
    },
    {
      title: 'เลขที่จอด',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: '',
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
      <Input
        placeholder="ค้นหาข้อมูลลูกค้า"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        style={{ marginBottom: 8, width: 300, float: 'right' }} 
      />
      {loading ? (
        <Spin tip="กำลังโหลด..." />
      ) : (
        <Table dataSource={filteredCheckins} columns={columns} rowKey="Deposit_ID" />
      )}

      <Modal
        title="ใบเสร็จ"
        visible={receiptModalVisible}
        onCancel={() => setReceiptModalVisible(false)}
        footer={null}
      >
        {receiptData && (
          <div>
            <p><strong>เลขที่การฝาก:</strong> {receiptData.Deposit_ID}</p>
            <p><strong>ชื่อลูกค้า:</strong> {receiptData.Customer}</p>
            <p><strong>ทะเบียนรถ:</strong> {receiptData.RegisterPlateNo}</p>
            <p><strong>ประเภท:</strong> {receiptData.Type_Name}</p>
            <p><strong>เลขที่จอด:</strong> {receiptData.Parking_ID}</p>
            <p><strong>วันที่และเวลาเช็คอิน:</strong> {dayjs(receiptData.Checkin_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <p><strong>วันที่และเวลาเช็คเอาท์:</strong> {dayjs(receiptData.Checkout_DateTime).format('DD/MM/YYYY HH:mm')}</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#1890ff' }}>
    <strong>เวลาจอด:</strong> {receiptData.Parking_Time} ชั่วโมง
  </div>
  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f5222d', marginLeft: '20px' }}>
    <strong>ค่าจอด:</strong> {receiptData.Parking_Fee} บาท
  </div>
</div>

          </div>
        )}
      </Modal>
    </div>
  );
}

export default CheckinTable;
