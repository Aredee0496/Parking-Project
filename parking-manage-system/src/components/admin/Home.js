import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Col, Row, Statistic } from 'antd';

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [parkingData, setParkingData] = useState({
    totalSpots: 0,
    availableSpots: 0,
    parkedCars: 0,
    bookedSpots: 0,
    type1Total: 0, // สำหรับประเภทที่จอด 1
    type2Total: 0, // สำหรับประเภทที่จอด 2
  });

  useEffect(() => {
    if (!user) {
      navigate("/verify"); 
    } else {
      console.log(user);
      // Fetch your parking data here
      fetchParkingData();
    }
  }, [user, navigate]);

  const fetchParkingData = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/parkings'); // Replace with your actual API endpoint
      const data = await response.json();

      // Assuming the data is an array of parking objects
      const totalSpots = data.length;
      const availableSpots = data.filter(parking => parking.PStatus_name === 'ว่าง').length;
      const parkedCars = data.filter(parking => parking.PStatus_name === 'ไม่ว่าง').length;
      const bookedSpots = data.filter(parking => parking.PStatus_name === 'จอง').length;

      // แยกประเภทที่จอดโดย Type_ID
      const type1Total = data.filter(parking => parking.Type_ID === '1').length;
      const type2Total = data.filter(parking => parking.Type_ID === '2').length;

      setParkingData({
        totalSpots,
        availableSpots,
        parkedCars,
        bookedSpots,
        type1Total,
        type2Total
      });
    } catch (error) {
      console.error("Error fetching parking data:", error);
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนที่จอดทั้งหมด" value={parkingData.totalSpots} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนที่จอดประเภทในร่ม" value={parkingData.type1Total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนที่จอดประเภทกลางแจ้ง" value={parkingData.type2Total} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนที่จอดว่าง" value={parkingData.availableSpots} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนรถที่จอด" value={parkingData.parkedCars} />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic title="จำนวนที่จอดที่จอง" value={parkingData.bookedSpots} />
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Home;
