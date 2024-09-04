import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { Form, DatePicker, Button, message, Card } from 'antd';
import { BiSolidCarGarage, BiSolidCar } from "react-icons/bi";

function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parkingType, setParkingType] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState(null);
  const [deposits, setDeposits] = useState([]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/booking/${user.id}`)
      .then(response => {
        setDeposits(response.data);
      })
      .catch(err => {
        console.error("Error fetching deposits:", err);
        message.error("ไม่สามารถดึงข้อมูลการจองได้");
      });
  }, [user, navigate]);

  const checkAvailability = async () => {
    const availabilityData = {
      Type_ID: parkingType,
      Booking_DateTime: bookingDateTime,
    };

    try {
      const response = await axios.post('http://localhost:5000/api/check-availability', availabilityData);
      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      return { available: false };
    }
  };
 
  const handleSubmit = async (values) => {
    const { available, Parking_ID } = await checkAvailability();

    if (!available) {
      message.error("ที่จอดรถไม่ว่างในช่วงเวลานี้ กรุณาเลือกช่วงเวลาอื่น");
      return;
    }

    const bookingData = {
      Customer_ID: user?.id,
      Type_ID: parkingType,
      Booking_DateTime: bookingDateTime,
      DepositStatus_ID: 1,
      Parking_ID: Parking_ID,
    };

    console.log("Booking Data:", bookingData);

    try {
      const response = await axios.post('http://localhost:5000/api/deposits', bookingData);
      console.log("Booking response:", response.data);
      message.success("จองสำเร็จ! Parking ID ของคุณคือ: " + Parking_ID);
      window.location.reload();
    } catch (error) {
      console.error("Error booking:", error);
    }
  };

  const handleCancel = async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deposits/${deposits.Deposit_ID}`);
      message.success("ยกเลิกการจองสำเร็จ");
      window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
      message.error("ไม่สามารถยกเลิกการจองได้");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>หน้าการจองลูกค้า</h1>

      {deposits ? (
        <Card title="ข้อมูลการจองปัจจุบัน" style={{ marginBottom: "20px" }}>
          <p><strong>ประเภทที่จอด:</strong> {deposits.Type_name}</p>
          <p><strong>วันที่และเวลาที่จอง:</strong> {dayjs(deposits.Booking_DateTime).format('YYYY-MM-DD HH:mm')}</p>
          <p><strong>Parking ID:</strong> {deposits.Parking_ID}</p>
          <p><strong>สถานะ:</strong> {deposits.DepositStatus_name}</p>
          <Button danger onClick={handleCancel}>ยกเลิกการจอง</Button>
        </Card>
      ) : (
        <Form onFinish={handleSubmit} layout="vertical">
          <Form.Item label="ประเภทที่จอด" required>
            <Button
              type={parkingType === "1" ? "primary" : "default"}
              onClick={() => setParkingType("1")}
              style={{ marginRight: "10px" }}
            >
              <BiSolidCarGarage size={30} />
              ในร่ม
            </Button>
            <Button
              type={parkingType === "2" ? "primary" : "default"}
              onClick={() => setParkingType("2")}
            >
              <BiSolidCar size={30} />
              กลางแจ้ง
            </Button>
          </Form.Item>

          <Form.Item label="วันที่และเวลาที่จอง" name="bookingDateTime" rules={[{ required: true, message: 'กรุณาเลือกวันที่และเวลา' }]}>
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              onChange={(date, dateString) => setBookingDateTime(dateString)}
              placeholder="เลือกวันที่และเวลา"
            />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">ยืนยันการจอง</Button>
          </Form.Item>
        </Form>
      )}
    </div>
  );
}

export default Booking;
