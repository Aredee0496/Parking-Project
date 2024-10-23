import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Card, Col, Row, Statistic, Table, Button, Modal, Select } from "antd";
import { BellOutlined, BellFilled } from "@ant-design/icons";
import { Pie } from "react-chartjs-2";
import { Chart, ArcElement, Tooltip, Legend } from "chart.js";
import axios from "axios";
import dayjs from "dayjs";

Chart.register(ArcElement, Tooltip, Legend);

function Home() {
  const { user } = useAuth();
  const { Option } = Select;
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [parkingData, setParkingData] = useState({
    totalSpots: 0,
    availableSpots: 0,
    parkedCars: 0,
    bookedSpots: 0,
    type1Total: 0,
    type2Total: 0,
    type1Available: 0,
    type1Parked: 0,
    type1Booked: 0,
    type2Available: 0,
    type2Parked: 0,
    type2Booked: 0,
  });

  const [reservations, setReservations] = useState([]);
  const [shuttleCalls, setShuttleCalls] = useState([]);
  const [timeSetting, setTimeSetting] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/verify");
    } else {
      fetchParkingData();
      fetchReservations();
      fetchShuttleCalls();
      fetchTimeSetting();
    }
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    const interval = setInterval(() => {
      fetchParkingData();
      fetchReservations();
      fetchShuttleCalls();
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [user, navigate]);

  const fetchTimeSetting = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/timesetting");
      setTimeSetting(response.data[0]?.time || 0);
    } catch (error) {
      console.error("Error fetching time setting:", error);
    }
  };

  const updateTimeSetting = async () => {
    try {
      await axios.put("http://localhost:5000/api/timesetting/1", {
        time: timeSetting,
      });
      setIsModalVisible(false);
      fetchTimeSetting();
    } catch (error) {
      console.error("Error updating time setting:", error);
    }
  };

  const hasReservations = reservations.length > 0;
  const hasShuttleCalls = shuttleCalls.length > 0;

  const fetchParkingData = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/parkings");
      const data = await response.json();

      const totalSpots = data.length;
      const availableSpots = data.filter(
        (parking) => parking.PStatus_name === "ว่าง"
      ).length;
      const parkedCars = data.filter(
        (parking) => parking.PStatus_name === "ไม่ว่าง"
      ).length;
      const bookedSpots = data.filter(
        (parking) => parking.PStatus_name === "จอง"
      ).length;

      const type1Total = data.filter(
        (parking) => parking.Type_ID === "1"
      ).length;
      const type2Total = data.filter(
        (parking) => parking.Type_ID === "2"
      ).length;

      const type1Available = data.filter(
        (parking) => parking.Type_ID === "1" && parking.PStatus_name === "ว่าง"
      ).length;
      const type1Parked = data.filter(
        (parking) =>
          parking.Type_ID === "1" && parking.PStatus_name === "ไม่ว่าง"
      ).length;
      const type1Booked = data.filter(
        (parking) => parking.Type_ID === "1" && parking.PStatus_name === "จอง"
      ).length;

      const type2Available = data.filter(
        (parking) => parking.Type_ID === "2" && parking.PStatus_name === "ว่าง"
      ).length;
      const type2Parked = data.filter(
        (parking) =>
          parking.Type_ID === "2" && parking.PStatus_name === "ไม่ว่าง"
      ).length;
      const type2Booked = data.filter(
        (parking) => parking.Type_ID === "2" && parking.PStatus_name === "จอง"
      ).length;

      setParkingData({
        totalSpots,
        availableSpots,
        parkedCars,
        bookedSpots,
        type1Total,
        type2Total,
        type1Available,
        type1Parked,
        type1Booked,
        type2Available,
        type2Parked,
        type2Booked,
      });
    } catch (error) {
      console.error("Error fetching parking data:", error);
    }
  };

  const fetchReservations = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/deposits");
      const filteredReservations = response.data.filter(
        (reservation) => reservation.DepositStatus_ID === 1
      );
      setReservations(filteredReservations);
    } catch (error) {
      console.error("Error fetching reservations:", error);
    }
  };

  const fetchShuttleCalls = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/callshuttles"
      );
      setShuttleCalls(response.data);
    } catch (error) {
      console.error("Error fetching shuttle calls:", error);
    }
  };

  const pieDataType1 = {
    labels: ["ว่าง", "ไม่ว่าง", "จอง"],
    datasets: [
      {
        label: "ประเภทในร่ม",
        data: [
          parkingData.type1Available,
          parkingData.type1Parked,
          parkingData.type1Booked,
        ],
        backgroundColor: ["#72d572", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#72d572", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const pieDataType2 = {
    labels: ["ว่าง", "ไม่ว่าง", "จอง"],
    datasets: [
      {
        label: "ประเภทกลางแจ้ง",
        data: [
          parkingData.type2Available,
          parkingData.type2Parked,
          parkingData.type2Booked,
        ],
        backgroundColor: ["#72d572", "#FF6384", "#FFCE56"],
        hoverBackgroundColor: ["#72d572", "#FF6384", "#FFCE56"],
      },
    ],
  };

  const columns = [
    {
      title: "ชื่อลูกค้า",
      dataIndex: "Customer_Fname",
      key: "Customer_Fname",
      render: (text, record) => `${text} ${record.Customer_Lname}`,
    },
    {
      title: "วันและเวลาที่จอง",
      dataIndex: "Booking_DateTime",
      key: "Booking_DateTime",
      render: (text) => dayjs(text).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "เลขที่จอด",
      dataIndex: "Parking_ID",
      key: "Parking_ID",
    },
  ];

  const shuttleColumns = [
    {
      title: "ชื่อลูกค้า",
      dataIndex: "Customer_Fname",
      key: "Customer_Fname",
      render: (text, record) => `${text} ${record.Customer_Lname}`,
    },
    {
      title: "เลขที่จอด",
      dataIndex: "Parking_ID",
      key: "Parking_ID",
    },
    {
      title: "จำนวนคน",
      dataIndex: "People",
      key: "People",
    },
  ];

  return (
    <div style={{ padding: "0px" }}>
      <div
        style={{
          width: "100%",
          backgroundColor: "#001529",
          padding: "1px",
          color: "#fff",
          fontSize: "18px",
          position: "sticky",
          borderRadius: "8px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ flexGrow: 1, textAlign: "center" }}>
          {currentTime.toLocaleDateString("th-TH")} -{" "}
          {currentTime.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
        <Button
          type="primary"
          size="small"
          style={{ marginLeft: "auto", marginRight: "2px" }}
          onClick={() => setIsModalVisible(true)}
        >
          กำหนดเวลาจองล่วงหน้า
        </Button>
      </div>

      <Row gutter={[8, 8]} style={{ marginTop: "20px" }}>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดทั้งหมด" value={parkingData.totalSpots} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดในร่ม" value={parkingData.type1Total} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดกลางแจ้ง" value={parkingData.type2Total} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดว่าง" value={parkingData.availableSpots} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดไม่ว่าง" value={parkingData.parkedCars} />
          </Card>
        </Col>
        <Col span={4}>
          <Card size="small">
            <Statistic title="ที่จอดจอง" value={parkingData.bookedSpots} />
          </Card>
        </Col>
      </Row>

      <Row gutter={[8, 8]} style={{ marginTop: "20px" }}>
        <Col span={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>ข้อมูลการจอง</span>
                <span
                  style={{
                    color: hasReservations ? "red" : "white",
                    fontSize: "24px",
                  }}
                >
                  {hasReservations ? <BellFilled /> : <BellOutlined />}
                </span>
              </div>
            }
          >
            <Link to="/bookings/reservations">
              <Table
                dataSource={reservations.slice(0, 2)}
                columns={columns}
                pagination={false}
              />
            </Link>
          </Card>
        </Col>
        <Col span={12}>
          <Card
            title={
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>ข้อมูลการเรียกรถ</span>
                <span
                  style={{
                    color: hasShuttleCalls ? "red" : "white",
                    fontSize: "24px",
                  }}
                >
                  {hasShuttleCalls ? <BellFilled /> : <BellOutlined />}
                </span>
              </div>
            }
          >
            <Link to="/shuttle">
              <Table
                dataSource={shuttleCalls.slice(0, 2)}
                columns={shuttleColumns}
                pagination={false}
              />
            </Link>
          </Card>
        </Col>
      </Row>

      <Row gutter={[8, 8]} style={{ marginTop: "20px" }}>
        <Col span={8}>
          <Card title="สถิติการจอดประเภทในร่ม">
            <Pie data={pieDataType1} />
          </Card>
        </Col>
        <Col span={8}>
          <Card title="สถิติการจอดประเภทกลางแจ้ง">
            <Pie data={pieDataType2} />
          </Card>
        </Col>
      </Row>

      <Modal
        title="ตั้งค่าเวลาจองล่วงหน้า"
        visible={isModalVisible}
        onOk={updateTimeSetting}
        onCancel={() => setIsModalVisible(false)}
      >
        <Select
          value={timeSetting}
          onChange={(value) => setTimeSetting(value)}
          style={{ width: "100%" }}
        >
          {[...Array(25).keys()].map((hour) => (
            <Option key={hour} value={hour}>
              {hour} ชั่วโมง
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
}

export default Home;
