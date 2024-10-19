import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Button, InputNumber, Typography, Alert, Row, Col, Empty } from "antd";

const { Title, Text } = Typography;

function RequestShuttle() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [deposits, setDeposits] = useState([]);
  const [callShuttles, setCallShuttles] = useState([]);
  const [peopleCount, setPeopleCount] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/verify");
    } else {
      const fetchData = () => {
        axios.get('http://localhost:5000/api/deposits/call')
          .then(response => {
            const filteredDeposits = response.data.filter(deposit => deposit.Customer_ID === user?.id);
            setDeposits(filteredDeposits);
          })
          .catch(err => {
            setError('Failed to fetch deposit data');
            console.error(err);
          });

        axios.get('http://localhost:5000/api/callshuttle/call')
          .then(response => {
            setCallShuttles(response.data);
          })
          .catch(err => {
            setError('Failed to fetch call shuttle data');
            console.error(err);
          });
      };

      fetchData();

      const intervalId = setInterval(fetchData, 10000);
      return () => clearInterval(intervalId);
    }
  }, [user, navigate]);

  const handleButtonClick = (depositId) => {
    const data = {
      Deposit_ID: depositId,
      People: parseInt(peopleCount[depositId], 10),
      CS_Status_ID: 1,
    };

    axios.post('http://localhost:5000/api/callshuttles', data)
      .then(response => {
        alert('เรียกรถสำเร็จ');
      })
      .catch(err => {
        setError('Failed to create call shuttle');
        console.error(err);
      });
  };

  const isButtonDisabled = (depositId) => {
    const count = parseInt(peopleCount[depositId], 10);
    return !count || isNaN(count) || count <= 0 || callShuttles.some(callShuttle => callShuttle.Deposit_ID === depositId);
  };

  const handlePeopleChange = (depositId, value) => {
    setPeopleCount({
      ...peopleCount,
      [depositId]: value,
    });
  };

  if (error) {
    return <Alert message={error} type="error" showIcon />;
  }

  return (
    <div className="request-shuttle-container">
      <Title level={2} style={{ textAlign: "center" }}>เรียกรถรับส่ง</Title>

      <div className="section">
        <Row gutter={[16, 16]}>
          {deposits.length === 0 ? (
            <Col span={24}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Empty description="🚫 ไม่มีรายการฝาก 🚫" />
              </Card>
            </Col>
          ) : (
            deposits.map(deposit => (
              <Col xs={24} md={12} key={deposit.Deposit_ID}>
                <Card title={`หมายเลขการฝาก: ${deposit.Deposit_ID}`} bordered={false}>
                  <InputNumber
                    min={1}
                    placeholder="จำนวนคน"
                    value={peopleCount[deposit.Deposit_ID] || ''}
                    onChange={(value) => handlePeopleChange(deposit.Deposit_ID, value)}
                    style={{ width: '100%', marginBottom: '10px' }}
                  />
                  <Button
                    type="primary"
                    onClick={() => handleButtonClick(deposit.Deposit_ID)}
                    disabled={isButtonDisabled(deposit.Deposit_ID)}
                    style={{ width: '100%' }}
                  >
                    เรียกรถ
                  </Button>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>

      <div className="section">
        <Title level={3}>ข้อมูลการเรียกรถ</Title>
        <Row gutter={[16, 16]}>
          {callShuttles.length === 0 ? (
            <Col span={24}>
              <Card bordered={false} style={{ textAlign: 'center' }}>
                <Empty description="🚫 ไม่มีรายการเรียกรถ 🚫" />
              </Card>
            </Col>
          ) : (
            callShuttles.map(callShuttle => (
              <Col xs={24} md={12} key={callShuttle.CallShuttle_ID}>
                <Card>
                  <Text><strong>หมายเลขการฝาก:</strong> {callShuttle.Deposit_ID}</Text><br />
                  <Text><strong>เลขทะเบียนรถรับส่ง:</strong> {callShuttle.RegisterPlateNo}</Text><br />
                  <Text><strong>จำนวนผู้โดยสาร:</strong> {callShuttle.People}</Text><br />
                  <Text><strong>สถานะการเรียกรถ:</strong> {callShuttle.CS_Status_name}</Text>
                </Card>
              </Col>
            ))
          )}
        </Row>
      </div>
    </div>
  );
}

export default RequestShuttle;
