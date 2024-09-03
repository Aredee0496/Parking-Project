import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import "./Parking.css";
import axios from "axios";
import { Select, Card, Modal, AutoComplete, Input, Button, notification ,DatePicker} from "antd";
import { SearchOutlined } from "@ant-design/icons";
import moment from 'moment';

const { Option } = Select;

function Parking() {
  const [parkingData, setParkingData] = useState([]);
  const { user: currentUser } = useAuth();
  const [filters, setFilters] = useState({ status: "ทั้งหมด", type: "ทั้งหมด" });
  const [currentTime, setCurrentTime] = useState(new Date());
  const [modalState, setModalState] = useState({
    visible: false,
    parking: null,
    customer: null,
    car: null,
    returnDate: "",
  });
  const [search, setSearch] = useState({ customer: "", data: [] });
  const [carData, setCarData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const parkingResponse = await axios.get("http://localhost:5000/api/parkings");
        setParkingData(parkingResponse.data);
      } catch (error) {
        console.error("Error fetching parking data:", error);
      }
    };

    fetchData();

    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const getStatusClass = (status) => {
    const statusClasses = {
      "ว่าง": "available",
      "ไม่ว่าง": "occupied",
      "จอง": "reserved",
    };
    return statusClasses[status] || "";
  };

  const filteredParkingData = parkingData.filter(
    (spot) =>
      (filters.status === "ทั้งหมด" || spot.PStatus_name === filters.status) &&
      (filters.type === "ทั้งหมด" || spot.Type_name === filters.type)
  );

  const handleCheckIn = async () => {
    const { parking, customer, car, returnDate } = modalState;
    if (!customer || !parking) return;
  
    const currentDateTime = new Date().toLocaleString('sv-SE', { timeZone: 'Asia/Bangkok' }).replace(' ', 'T');
  
    const depositData = {
      Customer_ID: customer.Customer_ID,
      Type_ID: parking.Type_ID,
      Car_ID: car?.Car_ID || "",
      Parking_ID: parking.Parking_ID,
      Return_DateTime: returnDate,
      Checkin_DateTime: currentDateTime + 'Z',
      Officer_ID: currentUser.id,
      DepositStatus_ID: 2,
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/deposits', depositData);
      if (response.status === 200) {
        await axios.put(`http://localhost:5000/api/parkings/${parking.Parking_ID}`, { PStatus_ID: "2" });
        setModalState((prev) => ({ ...prev, visible: false }));
        notification.success({
          message: 'Check-in Successful',
          description: 'เช็คอินสำเร็จ',
          placement: 'topRight',
        });
        await fetchData();
      }
    } catch (error) {
      console.error("Error checking in:", error);
      notification.error({
        message: 'Check-in Error',
        description: 'There was an error processing the check-in. Please try again.',
        placement: 'topRight',
      });
    }
  };
  
  
  const fetchData = async () => {
    try {
      const parkingResponse = await axios.get("http://localhost:5000/api/parkings");
      setParkingData(parkingResponse.data);
    } catch (error) {
      console.error("Error fetching parking data:", error);
    }
  };

  const handleSearchCustomer = async (value) => {
    setSearch((prev) => ({ ...prev, customer: value }));
    try {
      const response = await axios.get("http://localhost:5000/api/customers");
      setSearch((prev) => ({
        ...prev,
        data: response.data.filter(
          (customer) =>
            customer.Customer_Fname.includes(value) ||
            customer.Customer_Lname.includes(value)
        ),
      }));
    } catch (error) {
      console.error("Error searching customer data:", error);
    }
  };

  const handleSelectCustomer = async (customerId) => {
    const customer = search.data.find((cust) => cust.Customer_ID === customerId);
    setModalState((prev) => ({ ...prev, customer }));
    setSearch((prev) => ({ ...prev, customer: `${customer.Customer_Fname} ${customer.Customer_Lname}` }));
    try {
      const carResponse = await axios.get(`http://localhost:5000/api/cars?customerId=${customerId}`);
      setCarData(carResponse.data);
    } catch (error) {
      console.error("Error fetching car data:", error);
    }
  };

  const handleSelectCar = (value) => {
    const car = carData.find((car) => car.RegisterPlateNo === value);
    setModalState((prev) => ({ ...prev, car }));
  };

  return (
    <div>
      <Card
        style={{
          textAlign: "center",
          backgroundColor: "#001529",
          borderRadius: "20px",
          width: "120px",
          height: "80px",
        }}
      >
        <div style={{ fontSize: "12px", fontWeight: "bold", color: "#fff" }}>
          {currentTime.toLocaleDateString("th-TH")}
          <div style={{ fontSize: "14px", fontWeight: "bold", color: "#1890ff" }}>
          {currentTime.toLocaleTimeString("th-TH", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false,
          })}
        </div>
        </div>
      </Card>

      <Modal
        title={`ฟอร์มการฝาก ${modalState.parking?.Type_name} ${modalState.parking?.Parking_ID}`}
        visible={modalState.visible}
        onCancel={() => setModalState({ visible: false, parking: null, customer: null, car: null, returnDate: "" })}
        centered
        width={600}
        footer={[
          <Button key="cancel" danger onClick={() => setModalState((prev) => ({ ...prev, visible: false }))}>
            ยกเลิก
          </Button>,
          <Button key="checkin" type="primary" onClick={handleCheckIn}>
            Check In
          </Button>,
        ]}
      >
        <div style={{ marginBottom: "20px" }}>
          <label style={{ marginRight: "10px" }}>ค้นหาข้อมูล :</label>
          <AutoComplete
            value={search.customer}
            onSearch={handleSearchCustomer}
            onSelect={handleSelectCustomer}
            options={search.data.map((customer) => ({
              value: customer.Customer_ID,
              label: `${customer.Customer_Fname} ${customer.Customer_Lname}`,
            }))}
            style={{ width: "100%" }}
            placeholder="ค้นหาชื่อลูกค้า"
          >
            <Input suffix={<SearchOutlined />} onChange={(e) => handleSearchCustomer(e.target.value)} />
          </AutoComplete>
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>รหัสลูกค้า :</label>
          <Input value={modalState.customer?.Customer_ID || ""} disabled />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>ชื่อ-นามสกุล :</label>
          <Input value={`${modalState.customer?.Customer_Fname || ""} ${modalState.customer?.Customer_Lname || ""}`} disabled />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>เบอร์โทรศัพท์ :</label>
          <Input value={modalState.customer?.Customer_Tel || ""} disabled />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label>ทะเบียนรถ :</label>
          <Select style={{ width: "100%" }} onChange={handleSelectCar}>
            {carData.filter((car) => car.Customer_ID === modalState.customer?.Customer_ID).map((car) => (
              <Option key={car.Car_ID} value={car.RegisterPlateNo}>{car.RegisterPlateNo}</Option>
            ))}
          </Select>
        </div>
        <div style={{ marginBottom: "20px" }}>
  <label>วันที่เวลากลับ :</label>
  <DatePicker
    showTime
    format="YYYY-MM-DD HH:mm"
    onChange={(date, dateString) => setModalState((prev) => ({ ...prev, returnDate: dateString }))}
    placeholder="เลือกวันที่และเวลา"
    value={modalState.returnDate ? moment(modalState.returnDate) : null}
  />
</div>
      </Modal>

      <div className="status-select">
        <h2>สถานะ :</h2>
        <Select
          value={filters.status}
          onChange={(value) => setFilters((prev) => ({ ...prev, status: value }))}
          style={{ width: 120 }}
        >
          <Option value="ทั้งหมด">ทั้งหมด</Option>
          <Option value="ว่าง">ว่าง</Option>
          <Option value="ไม่ว่าง">ไม่ว่าง</Option>
          <Option value="จอง">จอง</Option>
        </Select>
      </div>

      <div className="legend top-right">
        {["available", "occupied", "reserved"].map((status) => (
          <div key={status} className="legend-item">
            <span className={`legend-color ${status}`}></span> {status === "available" ? "ว่าง" : status === "occupied" ? "ไม่ว่าง" : "จอง"}
          </div>
        ))}
      </div>

      <div className="filter-section">
        <h2>ประเภท :</h2>
        <div className="button-group">
          {["ทั้งหมด", "ในร่ม", "กลางแจ้ง"].map((type) => (
            <button
              key={type}
              className={filters.type === type ? "active" : ""}
              onClick={() => setFilters((prev) => ({ ...prev, type }))}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="parking-grid">
        {filteredParkingData.map((spot) => (
          <div
            key={spot.Parking_ID}
            className={`parking-spot ${getStatusClass(spot.PStatus_name)}`}
            onClick={() => {
              if (spot.PStatus_name === "ว่าง") {
                setModalState((prev) => ({ ...prev, visible: true, parking: spot }));
              }
            }}
          >
            {spot.Parking_ID}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Parking;
