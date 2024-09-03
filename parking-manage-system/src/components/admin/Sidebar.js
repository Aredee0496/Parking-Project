import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { HomeOutlined, CarOutlined, ScheduleOutlined, BarChartOutlined, UserOutlined, LogoutOutlined } from '@ant-design/icons';
import './Sidebar.css';

const { SubMenu } = Menu;

const Sidebar = () => {
  const { user, setUser } = useAuth(); 

  const handleLogout = () => {
    localStorage.removeItem('jwt'); 
    setUser(null);
  };

  return (
    <nav className="sidebar">
      <Menu mode="inline" theme="dark" defaultSelectedKeys={['/']} style={{ height: '100%', borderRight: 0 }}>
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <NavLink to="/" exact activeClassName="active">Home</NavLink>
        </Menu.Item>
        <Menu.Item key="/bookings" icon={<ScheduleOutlined />}>
          <NavLink to="/bookings" activeClassName="active">Bookings</NavLink>
        </Menu.Item>
        <Menu.Item key="/parking" icon={<CarOutlined />}>
          <NavLink to="/parking" activeClassName="active">Parking</NavLink>
        </Menu.Item>
        <Menu.Item key="/shuttle" icon={<ScheduleOutlined />}>
          <NavLink to="/shuttle" activeClassName="active">Shuttle</NavLink>
        </Menu.Item>
        
        {user && user.role === 'manager' && (
          <>
            <SubMenu key="reports" icon={<BarChartOutlined />} title="Reports">
              <Menu.Item key="/reports/revenue">
                <NavLink to="/reports/revenue" activeClassName="active">Revenue</NavLink>
              </Menu.Item>
              <Menu.Item key="/reports/usage">
                <NavLink to="/reports/usage" activeClassName="active">Usage Statistics</NavLink>
              </Menu.Item>
            </SubMenu>
            <SubMenu key="dataManagement" icon={<UserOutlined />} title="Data Management">
              <Menu.Item key="/data-management/parkinglist">
                <NavLink to="/data-management/parkinglist" activeClassName="active">ข้อมูลที่จอดรถ</NavLink>
              </Menu.Item>
              <Menu.Item key="/data-management/employee">
                <NavLink to="/data-management/employee" activeClassName="active">ข้อมูลพนักงาน</NavLink>
              </Menu.Item>
              <Menu.Item key="/data-management/customer">
                <NavLink to="/data-management/customer" activeClassName="active">ข้อมูลลูกค้า</NavLink>
              </Menu.Item>
              <Menu.Item key="/data-management/shuttle">
                <NavLink to="/data-management/shuttle" activeClassName="active">ข้อมูลรถรับส่ง</NavLink>
              </Menu.Item>
            </SubMenu>
          </>
        )}
        
        <Menu.Item key="/logout" icon={<LogoutOutlined />} style={{ marginTop: 'auto' }}>
          <NavLink to="/logout" activeClassName="active" onClick={handleLogout}>Logout</NavLink>
        </Menu.Item>
      </Menu>
    </nav>
  );
};

export default Sidebar;
