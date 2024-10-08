import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2"; 
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";
import ChartDataLabels from 'chartjs-plugin-datalabels'; // Import the plugin
import { Card, Row, Col } from "antd";

// Register necessary components for Chart.js
ChartJS.register(ArcElement, Tooltip, Legend, Title, Filler, ChartDataLabels);

function Usage() {
  const [chartData, setChartData] = useState({});
  const [totalHours, setTotalHours] = useState(0);
  const [usageSummary, setUsageSummary] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const depositsResponse = await fetch("http://localhost:5000/api/deposits");
        const depositsData = await depositsResponse.json();

        const receiptsResponse = await fetch("http://localhost:5000/api/receipts");
        const receiptsData = await receiptsResponse.json();

        const typeNames = {
          1: "ประเภทในร่ม",
          2: "ประเภทกลางแจ้ง",
        };

        const summary = {};
        const typeMap = {};

        depositsData.forEach(deposit => {
          typeMap[deposit.Deposit_ID] = deposit.Type_ID;
        });

        receiptsData.forEach(receipt => {
          const typeID = typeMap[receipt.Deposit_ID];
          const hours = receipt.Parking_Time;

          if (typeID) {
            const typeName = typeNames[typeID];
            if (summary[typeName]) {
              summary[typeName] += hours;
            } else {
              summary[typeName] = hours;
            }
          }
        });

        const formattedData = {
          labels: Object.keys(summary),
          datasets: [
            {
              label: "ชั่วโมงการจอด",
              data: Object.values(summary),
              backgroundColor: ["#0088FE", "#00C49F"],
            },
          ],
        };

        setChartData(formattedData);
        setTotalHours(formattedData.datasets[0].data.reduce((sum, entry) => sum + entry, 0));
        setUsageSummary(summary);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  // Define colors for each type
  const colors = {
    "ประเภทกลางแจ้ง": "#0088FE",
    "ประเภทในร่ม": "#00C49F",
  };

  return (
    <div style={{ padding: "20px" }}>
      <Row gutter={16}>
        <Col span={12}>
          {chartData.labels && chartData.datasets && chartData.labels.length > 0 && chartData.datasets[0].data.length > 0 ? (
            <Card title="กราฟชั่วโมงการจอด" style={{ borderRadius: '8px' }}>
              <Doughnut 
                data={chartData} 
                options={{ 
                  cutout: '60%',
                  plugins: {
                    legend: {
                      display: true,
                      position: 'top',
                    },
                    datalabels: {
                      formatter: (value, context) => {
                        const total = context.chart.data.datasets[0].data.reduce((acc, val) => acc + val, 0);
                        const percentage = ((value / total) * 100).toFixed(2) + '%';
                        return percentage;
                      },
                      color: 'white',
                    }
                  },
                }} 
              />
            </Card>
          ) : (
            <Card title="กราฟชั่วโมงการจอด" style={{ borderRadius: '8px' }}>
              <div>ไม่พบข้อมูลสำหรับกราฟ</div>
            </Card>
          )}
        </Col>
        <Col span={12}>
          <Card title="สรุปชั่วโมงการจอด" style={{ height: "100%", borderRadius: '8px' }}>
            {Object.entries(usageSummary).map(([type, hours]) => (
              <div key={type} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                {/* Colored box */}
                <div style={{
                  width: '20px',
                  height: '20px',
                  backgroundColor: colors[type],
                  borderRadius: '4px',
                  marginRight: '10px',
                }} />
                <div style={{ flexGrow: 1 }}>
                  <strong>{type}:</strong> {hours} ชั่วโมง
                </div>
              </div>
            ))}
            <div style={{ marginTop: "10px", fontWeight: 'bold', fontSize: '1.1em', borderTop: '1px solid #e8e8e8', paddingTop: '10px' }}>
              <strong>จำนวนชั่วโมงรวม:</strong> {totalHours} ชั่วโมง
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}

export default Usage;
