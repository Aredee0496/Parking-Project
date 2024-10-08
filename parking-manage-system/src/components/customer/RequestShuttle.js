import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, Input, Button, Alert, Row, Col } from "antd";

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

  return (
    <div className="request-shuttle-mobile">
      <h1>เรียกรถรับส่ง</h1>

      {error && <Alert message={error} type="error" showIcon />}

      <div className="section">
        <Row gutter={16}>
          {deposits.map(deposit => (
            <Col span={8} key={deposit.Deposit_ID}>
              <Card title={`Deposit ID: ${deposit.Deposit_ID}`} bordered={false}>
                <Input
                  type="number"
                  placeholder="จำนวนคน"
                  value={peopleCount[deposit.Deposit_ID] || ''}
                  onChange={(e) => handlePeopleChange(deposit.Deposit_ID, e.target.value)}
                  className="people-input"
                  min="1"
                />
                <Button
                  type="primary"
                  onClick={() => handleButtonClick(deposit.Deposit_ID)}
                  disabled={isButtonDisabled(deposit.Deposit_ID)}
                  style={{ marginTop: '10px' }}
                >
                  เรียกรถ
                </Button>
              </Card>
            </Col>
          ))}
        </Row>
      </div>

      <div className="section">
        <h2>ข้อมูลการเรียกรถ</h2>
        <Row gutter={16}>
          {callShuttles.map(callShuttle => (
            <Col span={8} key={callShuttle.CallShuttle_ID}>
              <Card title={`Call Shuttle ID: ${callShuttle.CallShuttle_ID}`} bordered={false}>
                <p><strong>เลขทะเบียนรถรับส่ง:</strong> {callShuttle.RegisterPlateNo}</p>
                <p><strong>จำนวนผู้โดยสาร:</strong> {callShuttle.People}</p>
                <p><strong>Status:</strong> {callShuttle.CS_Status_name}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
}

export default RequestShuttle;
