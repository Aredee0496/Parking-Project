import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Card } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function ParkingData() {
  const { user } = useAuth();
  const [deposit, setDeposit] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/checkin/${user.id}`)
      .then(response => {
        setDeposit(response.data);
      })
      .catch(err => {
        console.log("Error");
      });
  }, [user]);

  const cardStyle = { 
    width: 300, 
    fontSize: '18px',
    lineHeight: '1.5', 
    padding: '20px' 
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '16px' }}>
      {deposit ? (
        <Card
          key={deposit.Deposit_ID}
          title={`Deposit ID: ${deposit.Deposit_ID}`}
          style={cardStyle}
        >
          <img src='/car.jpg' alt="Deposit" style={{ width: '100%', marginBottom: '16px' }} />
          <p>ชื่อลูกค้า : {deposit.Customer_Fname} {deposit.Customer_Lname}</p>
          <p>ทะเบียนรถ : {deposit.RegisterPlateNo || 'N/A'}</p>
          <p>ประเภทที่จอด : {deposit.Type_name}</p>
          <p>เลขที่จอด : {deposit.Parking_ID}</p>
          <p>ชื่อพนักงาน : {deposit.Officer_Fname} {deposit.Officer_Lname}</p>
          <p>สถานะ : {deposit.DepositStatus_name}</p>
          <p>วันที่และเวลาเช็คอิน: {dayjs(deposit.CheckinDateTime).format('DD/MM/YYYY HH:mm')}</p>
        </Card>
      ) : (
        <Card style={cardStyle}>
          <p>ท่านยังไม่มีรายการฝากรถ</p>
          <img src='/nopk.jpg' alt="No Deposit" style={{ width: '100%', marginBottom: '16px' }} />
        </Card>
      )}
    </div>
  );
}

export default ParkingData;
