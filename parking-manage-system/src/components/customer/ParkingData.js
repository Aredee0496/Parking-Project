import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Card} from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

function ParkingData() {
  const { user } = useAuth();
  const [deposit, setDeposit] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/checkin/${user.id}`)
      .then(response => {
        setDeposit(response.data)
        console.log("การจอด", response.data)
      })
      .catch(err => {
        console.log("Error");
      });
  }, [user]);

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
      {deposit ? (
         (
          <Card
            key={deposit.Deposit_ID}
            title={`Deposit ID: ${deposit.Deposit_ID}`}
            style={{ width: 300 }}
          >
            <p>Customer Name: {deposit.Customer_Fname} {deposit.Customer_Lname}</p>
            <p>Register Plate No: {deposit.RegisterPlateNo || 'N/A'}</p>
            <p>Type: {deposit.Type_name}</p>
            <p>Parking ID: {deposit.Parking_ID}</p>
            <p>Officer Name: {deposit.Officer_Fname} {deposit.Officer_Lname}</p>
            <p>Deposit Status: {deposit.DepositStatus_name}</p>
            <p>Check-in DateTime: {dayjs(deposit.CheckinDateTime).format('DD/MM/YYYY HH:mm')}</p>
          </Card>
        )
      ) : (
        <Card style={{ width: 300, margin: '0 auto', textAlign: 'center' }}>
          <p>No deposit records found.</p>
        </Card>
      )}
    </div>
  );
}

export default ParkingData;
