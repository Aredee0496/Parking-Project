import React from 'react';
import { Link, Route, Routes, Navigate } from 'react-router-dom';
import { Button } from 'antd';
import ReservationTable from './ReservationTable';
import CheckinTable from './CheckinTable';
import CheckoutTable from './CheckoutTable';

const Bookings = () => {
  return (
    <div>
      <nav>
        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'row' }}>
          <li style={{ marginRight: '8px' }}>
            <Button type="primary">
              <Link to="reservations">Reservations</Link>
            </Button>
          </li>
          <li style={{ marginRight: '8px' }}>
            <Button type="primary">
              <Link to="checkins">Check-ins</Link>
            </Button>
          </li>
          <li>
            <Button type="primary">
              <Link to="checkouts">Check-outs</Link>
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
