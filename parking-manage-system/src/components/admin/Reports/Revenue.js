import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import { Card, Statistic, DatePicker, Button } from 'antd';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween'; // นำเข้าปลั๊กอิน isBetween
import { Chart, registerables } from 'chart.js';

// ลงทะเบียนปลั๊กอิน isBetween กับ dayjs
dayjs.extend(isBetween);

// ลงทะเบียนคอมโพเนนต์ที่จำเป็นทั้งหมด
Chart.register(...registerables);

const Revenue = () => {
    const [allData, setAllData] = useState([]); // เก็บข้อมูลทั้งหมด
    const [displayData, setDisplayData] = useState([]); // เก็บข้อมูลที่จะแสดง
    const [summary, setSummary] = useState({
      dailyRevenue: 0,
      monthlyRevenue: 0,
      totalRevenue: 0,
    });
    const [dateRange, setDateRange] = useState([dayjs().startOf('month'), dayjs().endOf('month')]);
    const [viewMode, setViewMode] = useState('daily'); // สถานะการแสดงผล (daily/monthly)

    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch('http://localhost:5000/api/receipts');
        const result = await response.json();

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

        setAllData(groupedData); // ตั้งค่าข้อมูลทั้งหมด
        setDisplayData(groupedData); // แสดงข้อมูลทั้งหมดในตอนแรก
        calculateSummary(groupedData); // คำนวณสรุปสำหรับข้อมูลดั้งเดิม
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
        setDateRange([start, end]);
    
        const filteredData = allData.filter((item) =>
          dayjs(item.date).isBetween(start.startOf('day'), end.endOf('day'), null, '[]')
        );
    
        const sortedData = filteredData.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1);
    
        calculateSummary(sortedData);
        setDisplayData(sortedData);
      }
    };
    
    const handleViewModeChange = (mode) => {
      setViewMode(mode);
      // เปลี่ยนข้อมูลที่จะแสดงตามโหมด
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
        const sortedData = allData.filter((item) =>
          dayjs(item.date).isBetween(dateRange[0].startOf('day'), dateRange[1].endOf('day'), null, '[]')
        ).sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1);
    
        setDisplayData(sortedData);
      }
    };
    

    const chartData = {
      labels: displayData.map(item => item.date), // วันที่เป็นป้ายชื่อ
      datasets: [
        {
          label: 'Revenue (รายได้)',
          data: displayData.map(item => item.revenue), // รายได้เป็นข้อมูล
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
      <div>
        <DatePicker.RangePicker
          defaultValue={dateRange}
          onChange={handleDateChange}
          style={{ marginBottom: '20px' }}
        />
        <Button onClick={() => handleViewModeChange('daily')} type={viewMode === 'daily' ? 'primary' : 'default'} style={{ marginRight: '10px' }}>
          รายวัน
        </Button>
        <Button onClick={() => handleViewModeChange('monthly')} type={viewMode === 'monthly' ? 'primary' : 'default'}>
          รายเดือน
        </Button>
        <Bar data={chartData} options={options} />

        <Card style={{ marginTop: '20px' }}>
          <Statistic title="รายได้วันนี้" value={summary.dailyRevenue} precision={2} />
          <Statistic title="รายได้เดือนนี้" value={summary.monthlyRevenue} precision={2} style={{ marginTop: 16 }} />
          <Statistic title="รายได้ทั้งหมด" value={summary.totalRevenue} precision={2} style={{ marginTop: 16 }} />
        </Card>
      </div>
    );
  };

export default Revenue;
