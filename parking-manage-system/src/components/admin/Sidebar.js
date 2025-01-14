import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Menu, Button, notification, Modal, Form, Input } from "antd";
import { useAuth } from "../../context/AuthContext";
import {
  HomeOutlined,
  CarOutlined,
  ScheduleOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import "./Sidebar.css";

const { SubMenu } = Menu;

const Sidebar = () => {
  const { user, setUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5000/api/officers/${user.id}`
        );
        setProfile(response.data);
        form.setFieldsValue({
          Officer_Fname: response.data.Officer_Fname,
          Officer_Lname: response.data.Officer_Lname,
          Officer_Username: response.data.Officer_Username,
          Officer_Password: response.data.Officer_Password,
          Officer_Tel: response.data.Officer_Tel,
        });
      } catch (error) {
        notification.error({ message: "Error fetching profile" });
      }
    };
    if (user) {
      fetchProfile();
    }
  }, [user, form]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
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
      notification.success({ message: "Profile updated successfully" });
      setProfile(values);
      setIsModalVisible(false);
    } catch (error) {
      notification.error({ message: "Error updating profile" });
    }
  };

  const location = useLocation();

  return (
    <nav className="sidebar">
      <Menu
        mode="inline"
        theme="dark"
        defaultSelectedKeys={[location.pathname]}
        style={{ height: "100%", borderRight: 0 }}
      >
        <Menu.Item key="/" icon={<HomeOutlined />}>
          <NavLink to="/" exact activeClassName="active">
            หน้าหลัก
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/bookings" icon={<ScheduleOutlined />}>
          <NavLink to="/bookings" activeClassName="active">
            หน้ารายการ
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/parking" icon={<CarOutlined />}>
          <NavLink to="/parking" activeClassName="active">
            หน้าที่จอดรถ
          </NavLink>
        </Menu.Item>
        <Menu.Item key="/shuttle" icon={<ScheduleOutlined />}>
          <NavLink to="/shuttle" activeClassName="active">
            หน้ารถรับส่ง
          </NavLink>
        </Menu.Item>

        {user && (user.role === "manager" || user.role === "employee") && (
          <>
            <SubMenu
              key="dataManagement"
              icon={<UserOutlined />}
              title="จัดการข้อมูล"
            >
              {user.role === "manager" && (
                <>
                  <Menu.Item key="/data-management/parkinglist">
                    <NavLink
                      to="/data-management/parkinglist"
                      activeClassName="active"
                    >
                      ข้อมูลที่จอดรถ
                    </NavLink>
                  </Menu.Item>
                  <Menu.Item key="/data-management/employee">
                    <NavLink
                      to="/data-management/employee"
                      activeClassName="active"
                    >
                      ข้อมูลพนักงาน
                    </NavLink>
                  </Menu.Item>
                </>
              )}
              <Menu.Item key="/data-management/customer">
                <NavLink
                  to="/data-management/customer"
                  activeClassName="active"
                >
                  ข้อมูลลูกค้า
                </NavLink>
              </Menu.Item>
              <Menu.Item key="/data-management/shuttle">
                <NavLink to="/data-management/shuttle" activeClassName="active">
                  ข้อมูลรถรับส่ง
                </NavLink>
              </Menu.Item>
            </SubMenu>
          </>
        )}

        {user && user.role === "manager" && (
          <SubMenu key="reports" icon={<BarChartOutlined />} title="รายงาน">
            <Menu.Item key="/reports/revenue">
              <NavLink to="/reports/revenue" activeClassName="active">
                รายได้
              </NavLink>
            </Menu.Item>
            <Menu.Item key="/reports/usage">
              <NavLink to="/reports/usage" activeClassName="active">
                สถิติการใช้ที่จอดรถ
              </NavLink>
            </Menu.Item>
          </SubMenu>
        )}

        <Menu.Item
          key="/logout"
          icon={<LogoutOutlined />}
          style={{ marginTop: "auto" }}
        >
          <NavLink to="/logout" activeClassName="active" onClick={handleLogout}>
            ออกจากระบบ
          </NavLink>
        </Menu.Item>

        {/* Profile Section */}
        {profile && (
          <div
            className="sidebar-profile"
            style={{
              padding: "10px",
              color: "#fff",
              borderTop: "1px solid rgba(255, 255, 255, 0.2)",
              marginTop: "auto",
              textAlign: "center",
            }}
          >
            <h3>{`${profile.Officer_Fname} ${profile.Officer_Lname}`}</h3>
            <h4>{`${profile.Role}`}</h4>
            <Button type="primary" onClick={showModal} icon={<EditOutlined />}>
              แก้ไขโปรไฟล์
            </Button>
          </div>
        )}
      </Menu>

      <Modal
        title="แก้ไขโปรไฟล์"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item label="ชื่อ" name="Officer_Fname">
            <Input />
          </Form.Item>
          <Form.Item label="นามสกุล" name="Officer_Lname">
            <Input />
          </Form.Item>
          <Form.Item label="Username" name="Officer_Username">
            <Input />
          </Form.Item>
          <Form.Item
            label="Password"
            name="Officer_Password"
          >
            <Input.Password />
          </Form.Item>
          <Form.Item label="เบอร์โทรศัพท์" name="Officer_Tel">
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              บันทึก
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </nav>
  );
};

export default Sidebar;
