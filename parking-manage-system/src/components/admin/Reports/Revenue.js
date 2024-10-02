import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Statistic, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { Chart, registerables } from 'chart.js';

dayjs.extend(isBetween);

Chart.register(...registerables);

const Revenue = () => {
    const [allData, setAllData] = useState([]); 
    const [displayData, setDisplayData] = useState([]);
    const [summary, setSummary] = useState({
      dailyRevenue: 0,
      monthlyRevenue: 0,
      totalRevenue: 0,
    });
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]); // ตั้งค่าเริ่มต้นเป็นช่วงเดือนปัจจุบัน // เริ่มต้นเป็น null เพื่อให้ไม่มีค่ากำหนด
    const [viewMode, setViewMode] = useState('daily'); 

    useEffect(() => {
      const fetchData = async () => {
          const response = await fetch('http://localhost:5000/api/receipts');
          const result = await response.json();
  
          // จัดกลุ่มข้อมูลตามวันที่และรวมรายได้
          const groupedData = result.reduce((acc, curr) => {
              const date = dayjs(curr.Receipt_DateTime).format('YYYY-MM-DD');
              const existing = acc.find((item) => item.date === date);
  
              if (existing) {
                  existing.revenue += curr.Parking_Fee;
              } else {
                  acc.push({
                      date: date,
                      revenue: curr.Parking_Fee,
                  });
              }
              return acc;
          }, []);
  
          // จัดเรียงข้อมูลตามวันที่จากเก่ามาใหม่
          const sortedData = groupedData.sort((a, b) => dayjs(a.date).isBefore(dayjs(b.date)) ? -1 : 1);
  
          // เลือกแค่ 5 วันที่ล่าสุด
          const recentData = sortedData.slice(-5);
  
          setAllData(groupedData);  // เก็บข้อมูลทั้งหมด
          setDisplayData(recentData); // แสดงเฉพาะ 5 วันที่ล่าสุด
          calculateSummary(recentData);
      };
  
      fetchData();
  }, []);  

  const calculateSummary = (data) => {
    const totalRevenue = data.reduce((acc, curr) => acc + curr.revenue, 0);
    const todayRevenue = data.filter(
        (item) => item.date === dayjs().format('YYYY-MM-DD')
    ).reduce((acc, curr) => acc + curr.revenue, 0);

    const monthRevenue = data.filter(
        (item) => dayjs(item.date).isSame(dayjs(), 'month')
    ).reduce((acc, curr) => acc + curr.revenue, 0);

    setSummary({
        dailyRevenue: todayRevenue,
        monthlyRevenue: monthRevenue,
        totalRevenue: totalRevenue,
    });
};

const handleDateChange = (dates) => {
  if (dates) {
      const [start, end] = dates;

      if (start && end) {
          setDateRange([start, end]);

          const filteredData = allData.filter((item) =>
              dayjs(item.date).isBetween(start.startOf('day'), end.endOf('day'), null, '[]')
          );

          const sortedData = filteredData.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1);

          // เรียกใช้ calculateSummary กับข้อมูลที่กรอง
          calculateSummary(sortedData);
          setDisplayData(sortedData);
      }
  } else {
      const recentData = allData.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1).slice(-5);
      setDisplayData(recentData);
      calculateSummary(recentData);
  }
};


const handleViewModeChange = (mode) => {
  setViewMode(mode);

  if (mode === 'monthly') {
    const monthlyData = allData.reduce((acc, curr) => {
      const month = dayjs(curr.date).format('YYYY-MM');
      const existing = acc.find((item) => item.date === month);

      if (existing) {
        existing.revenue += curr.revenue;
      } else {
        acc.push({
          date: month,
          revenue: curr.revenue,
        });
      }
      return acc;
    }, []);

    const sortedData = monthlyData.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1);
    setDisplayData(sortedData);
  } else {
    if (dateRange[0] && dateRange[1]) {
      handleDateChange(dateRange); // ใช้ dateRange ปัจจุบันในการคำนวณใหม่
    }
  }
};


    const chartData = {
      labels: displayData.map(item => item.date), 
      datasets: [
        {
          label: 'Revenue (รายได้)',
          data: displayData.map(item => item.revenue), 
          backgroundColor: 'rgba(75, 192, 192, 0.6)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1,
        },
      ],
    };

    const options = {
      scales: {
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: 'Revenue (รายได้)',
          },
        },
        x: {
          title: {
            display: true,
            text: viewMode === 'daily' ? 'Date (วันที่)' : 'Month (เดือน)',
          },
        },
      },
    };

    return (
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ flex: 2 }}>
          <DatePicker.RangePicker
            onChange={handleDateChange}
            style={{ marginBottom: '20px' }}
          />
          <Button onClick={() => handleViewModeChange('daily')} type={viewMode === 'daily' ? 'primary' : 'default'} style={{ marginRight: '10px' }}>
            รายวัน
          </Button>
          <Button onClick={() => handleViewModeChange('monthly')} type={viewMode === 'monthly' ? 'primary' : 'default'}>
            รายเดือน
          </Button>
          <div style={{ width: '700px', marginTop: '20px' }}> 
            <Bar data={chartData} options={options} />
          </div>
        </div>

        <div style={{ flex: 1, marginLeft: '20px' }}>
          <Card>
            <Statistic title="รายได้วันนี้" value={summary.dailyRevenue} precision={2} />
            <Statistic title="รายได้เดือนนี้" value={summary.monthlyRevenue} precision={2} style={{ marginTop: 16 }} />
            <Statistic title="รายได้ทั้งหมด" value={summary.totalRevenue} precision={2} style={{ marginTop: 16 }} />
          </Card>
        </div>
      </div>
    );
};

export default Revenue;
