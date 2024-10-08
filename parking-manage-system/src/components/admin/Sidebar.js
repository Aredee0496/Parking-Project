import React, { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Menu, Button, notification, Modal, Form, Input } from 'antd';
import { useAuth } from '../../context/AuthContext';
import { HomeOutlined, CarOutlined, ScheduleOutlined, BarChartOutlined, UserOutlined, LogoutOutlined, EditOutlined } from '@ant-design/icons';
import axios from 'axios';
import './Sidebar.css';

const { SubMenu } = Menu;

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Form instance for profile editing
  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/officers/${user.id}`);
        setProfile(response.data);
        // Set form values with fetched profile data
        form.setFieldsValue({
          Officer_Fname: response.data.Officer_Fname,
          Officer_Lname: response.data.Officer_Lname,
          Officer_Username: response.data.Officer_Username,
          Officer_Tel: response.data.Officer_Tel,
        });
      } catch (error) {
        notification.error({ message: 'Error fetching profile' });
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user, form]);

  const handleLogout = () => {
    localStorage.removeItem('jwt');
    setUser(null);
  };

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSubmit = async (values) => {
    try {
      await axios.put(`http://localhost:5000/api/officers/${user.id}`, values);
      notification.success({ message: 'Profile updated successfully' });
      setProfile(values); // Update local profile state
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: 'Error updating profile' });
    }
  };
  const location = useLocation(); 

  return (
    <nav className="sidebar">
      <Menu mode="inline" theme="dark" defaultSelectedKeys={[location.pathname]} style={{ height: '100%', borderRight: 0 }}>
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

        {/* Profile Section */}
        {profile && (
          <div className="sidebar-profile" style={{ padding: '20px', color: 'white', borderTop: '1px solid rgba(255, 255, 255, 0.2)', marginTop: 'auto' }}>
            <p>{profile.Officer_Fname} {profile.Officer_Lname}</p>
            <Button type="link" style={{ color: 'white', padding: 0 }} onClick={showModal}>
              <EditOutlined />
            </Button>
          </div>
        )}

        {/* Edit Profile Modal */}
        <Modal title="Edit Profile" visible={isModalVisible} onCancel={handleCancel} footer={null}>
          <Form form={form} onFinish={handleSubmit} layout="vertical">
            <Form.Item label="First Name" name="Officer_Fname" rules={[{ required: true, message: 'Please input your first name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Last Name" name="Officer_Lname" rules={[{ required: true, message: 'Please input your last name!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Username" name="Officer_Username" rules={[{ required: true, message: 'Please input your username!' }]}>
              <Input />
            </Form.Item>
            <Form.Item label="Telephone" name="Officer_Tel" rules={[{ required: true, message: 'Please input your telephone number!' }]}>
              <Input />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">Submit</Button>
            </Form.Item>
          </Form>
        </Modal>
      </Menu>
    </nav>
  );
};

export default Sidebar;
