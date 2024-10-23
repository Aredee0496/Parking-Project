import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import dayjs from 'dayjs';
import { Form, DatePicker, Button, message, Card } from 'antd';
import { BiSolidCarGarage, BiSolidCar } from "react-icons/bi";
import duration from 'dayjs/plugin/duration';
import "./Booking.css";

dayjs.extend(duration);

function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parkingType, setParkingType] = useState("");
  const [bookingDateTime, setBookingDateTime] = useState(null);
  const [deposits, setDeposits] = useState([]);
  const [maxAdvanceHours, setMaxAdvanceHours] = useState(0);
  const [parkingTypes, setParkingTypes] = useState([]);

  useEffect(() => {
    const fetchTimeSettings = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/timesetting');
        setMaxAdvanceHours(response.data[0].time);
      } catch (error) {
        console.error("Error fetching time settings:", error);
      }
    };
    fetchTimeSettings();
  }, []);

  useEffect(() => {
    const fetchParkingTypes = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/types');
        setParkingTypes(response.data);
      } catch (error) {
        console.error("Error fetching parking types:", error);
        message.error("ไม่สามารถดึงข้อมูลประเภทที่จอดได้");
      }
    };
    fetchParkingTypes();
  }, []);

  const handleCancel = useCallback(async () => {
    try {
      await axios.delete(`http://localhost:5000/api/deposits/${deposits.Deposit_ID}`);
      message.success("ยกเลิกการจองสำเร็จ");
      window.location.reload();
    } catch (error) {
      console.error("Error canceling booking:", error);
      message.error("ไม่สามารถยกเลิกการจองได้");
    }
  }, [deposits.Deposit_ID]);

  useEffect(() => {
    axios.get(`http://localhost:5000/api/booking/${user.id}`)
      .then(response => {
        setDeposits(response.data);
        const bookingTime = dayjs(response.data.Booking_DateTime);
        const currentTime = dayjs();
        const diffMinutes = currentTime.diff(bookingTime, 'minute');

        if (diffMinutes > 15 && response.data.DepositStatus_ID === 1) {
          handleCancel(); 
        }
      })
      .catch(err => {
        console.error("Error fetching deposits:", err);
        message.error("ไม่สามารถดึงข้อมูลการจองได้");
      });
  }, [user, navigate, handleCancel]);

  const checkAvailability = async () => {
    if (!bookingDateTime || !parkingType) {
      message.error("กรุณาเลือกวันที่และประเภทที่จอดรถ");
      return { available: false };
    }

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
      message.success("จองสำเร็จ! เลขที่จอดของคุณคือ: " + Parking_ID);
      window.location.reload();
    } catch (error) {
      console.error("Error booking:", error);
    }
  };

  const disabledDate = (current) => {
    const maxDate = dayjs().add(maxAdvanceHours, 'hour');
    return current && (current < dayjs().startOf('day') || current > maxDate);
  };

  const handleDateChange = (date, dateString) => {
    if (date) {
      const currentTime = dayjs();
      if (date.isBefore(currentTime, 'minute')) {
        message.error("ไม่สามารถเลือกเวลาย้อนหลังได้");
        setBookingDateTime(null);
      } else {
        setBookingDateTime(dateString);
      }
    } else {
      setBookingDateTime(null);
    }
  };

  return (
    <div className="booking-container">
      <div className="booking-content">
        {deposits ? (
          <Card title="ข้อมูลการจองปัจจุบัน" className="booking-card">
            <p><strong>ประเภทที่จอด:</strong> {deposits.Type_name}</p>
            <p><strong>วันที่และเวลาที่จอง:</strong> {dayjs(deposits.Booking_DateTime).format('YYYY-MM-DD HH:mm')}</p>
            <p><strong>เลขที่จอด:</strong> {deposits.Parking_ID}</p>
            <p><strong>สถานะ:</strong> {deposits.DepositStatus_name}</p>
            <p><strong>กรุณามาก่อนเวลา:</strong>{" "}{dayjs(deposits.Booking_DateTime).add(15, "minute").format("YYYY-MM-DD HH:mm")}</p>
            <Button danger onClick={handleCancel} style={{ width: '100%' }}>ยกเลิกการจอง</Button>
          </Card>
        ) : (
          <Card>
            <Form onFinish={handleSubmit} layout="vertical">
              <div className="parking-price-info">
                <h3>ราคาที่จอดรถ:</h3>
                {parkingTypes.map((type) => (
                  <p key={type.Type_ID}>
                    <strong>{type.Type_name}:</strong> ชั่วโมงละ: {type.Price_Hour} บาท
                    เกิน 5 ชั่วโมง คิดเป็นวันละ: {type.Price_Day} บาท
                  </p>
                ))}
              </div>

              <div className="advance-booking-info">
                <p>**สามารถจองล่วงหน้าได้ไม่เกิน: {maxAdvanceHours} ชั่วโมง</p>
              </div>

              <Form.Item label="ประเภทที่จอด" required>
                <Button
                  type={parkingType === "1" ? "primary" : "default"}
                  onClick={() => setParkingType("1")}
                  className="parking-button"
                >
                  <BiSolidCarGarage size={30} />
                  ในร่ม
                </Button>
                <Button
                  type={parkingType === "2" ? "primary" : "default"}
                  onClick={() => setParkingType("2")}
                  className="parking-button"
                >
                  <BiSolidCar size={30} />
                  กลางแจ้ง
                </Button>
              </Form.Item>
              <Form.Item label="เลือกวันที่และเวลา" required>
                <DatePicker
                  showTime
                  format="YYYY-MM-DD HH:mm"
                  disabledDate={disabledDate}
                  onChange={handleDateChange}
                  className="date-picker"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" className="submit-button">
                  จอง
                </Button>
              </Form.Item>
            </Form>
          </Card>
        )}
      </div>
    </div>
  );
}

export default Booking;
