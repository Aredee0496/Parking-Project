import React from 'react';
import { Link } from 'react-router-dom';
import './FooterBar.css';

function FooterBar() {
  return (
    <div className="footer-bar">
      <ul className="footer-nav">
        <li><Link to="/customer/booking">การจอง</Link></li>
        <li><Link to="/customer/parking-data">การฝาก</Link></li>
        <li><Link to="/customer/request-shuttle">เรียกรถ</Link></li>
        <li><Link to="/customer/settings">ตั้งค่า</Link></li>
      </ul>
    </div>
  );
}

export default FooterBar;
