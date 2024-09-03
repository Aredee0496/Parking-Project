import React, { useEffect, useState } from 'react';
import { useAuth } from "../../context/AuthContext";
import { Table, Spin, Select, Button, message } from 'antd';
import axios from 'axios';
import dayjs from 'dayjs';

const { Option } = Select;

function ReservationTable() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();
  const [cars, setCars] = useState([]);
  const [selectedCarIds, setSelectedCarIds] = useState({}); // Track selected Car_IDs

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/deposits');
        const filteredReservations = response.data.filter(reservation => reservation.DepositStatus_ID === 1);
        setReservations(filteredReservations);
      } catch (error) {
        console.error('Error fetching reservations:', error);
      } finally {
        setLoading(false);
      }
    };

    const fetchCars = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/cars');
        setCars(response.data);
      } catch (error) {
        console.error('Error fetching vehicles:', error);
      }
    };

    fetchReservations();
    fetchCars();
  }, []);

  const handleCheckIn = async (id) => {
    const carId = selectedCarIds[id]; // Get the selected Car_ID for the specific reservation

    if (!carId) {
      message.error('Please select a car before checking in.');
      return;
    }

    try {
      await axios.put(`http://localhost:5000/api/deposits/${id}`, {
        Car_ID: carId,
        Checkin_DateTime: dayjs().toISOString(),  
        Officer_ID: currentUser.id, 
        DepositStatus_ID: 2,
      });

      // Fetch updated reservations after successful check-in
      const response = await axios.get('http://localhost:5000/api/deposits');
      const filteredReservations = response.data.filter(reservation => reservation.DepositStatus_ID === 1);
      setReservations(filteredReservations);

      message.success('Check-in successful!');
    } catch (error) {
      console.error('Error during check-in:', error);
      message.error('Check-in failed. Please try again.');
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
      render: (text, record) => {
        const customerCars = cars.filter(car => car.Customer_ID === record.Customer_ID);

        return (
          <Select 
            defaultValue="" 
            style={{ width: 120 }} 
            onChange={value => setSelectedCarIds(prev => ({ ...prev, [record.Deposit_ID]: value }))}
          >
            {customerCars.map(car => (
              <Option key={car.Car_ID} value={car.Car_ID}>
                {car.RegisterPlateNo}
              </Option>
            ))}
          </Select>
        );
      },
      key: 'registerPlateNo',
    },
    {
      title: 'Booking_DateTime',
      render: (text, record) => dayjs(record.Booking_DateTime).format('DD/MM/YYYY HH:mm'),
      key: 'Booking_DateTime',
    },
    {
      title: 'Parking_ID',
      dataIndex: 'Parking_ID',
      key: 'Parking_ID',
    },
    {
      title: 'Actions',
      render: (text, record) => (
        <Button onClick={() => handleCheckIn(record.Deposit_ID)} type="primary">
          Check-in
        </Button>
      ),
      key: 'actions',
    },
  ];

  return (
    <div>
      <h1>ตารางจอง</h1>
      {loading ? (
        <Spin tip="กำลังโหลด..." />
      ) : (
        <Table dataSource={reservations} columns={columns} rowKey="Deposit_ID" />
      )}
    </div>
  );
}

export default ReservationTable;