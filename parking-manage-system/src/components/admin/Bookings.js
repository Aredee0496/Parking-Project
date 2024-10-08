import React from 'react';
import { Link, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Button } from 'antd';
import { BookOutlined, CheckCircleOutlined, CheckSquareOutlined } from '@ant-design/icons';
import ReservationTable from './ReservationTable';
import CheckinTable from './CheckinTable';
import CheckoutTable from './CheckoutTable';

const Bookings = () => {
  const location = useLocation();

  // Determine the active tab based on the current route
  const getActiveStyle = (path) => ({
    backgroundColor: location.pathname.includes(path) ? '#1890ff' : 'white',
    color: location.pathname.includes(path) ? 'white' : 'black',
  });

  return (
    <div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, margin: 8, display: 'flex', flexDirection: 'row', alignItems: 'flex-start' }}>
          <li style={{ marginRight: '8px' }}>
            <Button
              type="primary"
              icon={<BookOutlined />}
              style={getActiveStyle('reservations')}
            >
              <Link to="reservations" style={{ color: 'inherit' }}>Reservations</Link>
            </Button>
          </li>
          <li style={{ marginRight: '8px' }}>
            <Button
              type="primary"
              icon={<CheckCircleOutlined />}
              style={getActiveStyle('checkins')}
            >
              <Link to="checkins" style={{ color: 'inherit' }}>Check-ins</Link>
            </Button>
          </li>
          <li>
            <Button
              type="primary"
              icon={<CheckSquareOutlined />}
              style={getActiveStyle('checkouts')}
            >
              <Link to="checkouts" style={{ color: 'inherit' }}>Check-outs</Link>
            </Button>
          </li>
        </ul>
      </nav>

      <Routes>
        {/* Redirect to reservations as default */}
        <Route path="/" element={<Navigate to="reservations" replace />} />
        <Route path="reservations" element={<ReservationTable />} />
        <Route path="checkins" element={<CheckinTable />} />
        <Route path="checkouts" element={<CheckoutTable />} />
      </Routes>
    </div>
  );
};

export default Bookings;
