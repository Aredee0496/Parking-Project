import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Login from "./Login";
import Sidebar from "./components/admin/Sidebar";
import FooterBar from "./components/customer/FooterBar";
import Home from "./components/admin/Home";
import Bookings from "./components/admin/Bookings";
import Parking from "./components/admin/Parking";
import Shuttle from "./components/admin/Shuttle";
import Booking from "./components/customer/Booking";
import ParkingData from "./components/customer/ParkingData";
import RequestShuttle from "./components/customer/RequestShuttle";
import Settings from "./components/customer/Settings";
import EditProfile from "./components/customer/EditProfile";
import ParkingHistory from "./components/customer/ParkingHistory";
import Revenue from "./components/admin/Reports/Revenue";
import Usage from "./components/admin/Reports/Usage";
import ParkingList from "./components/admin/DataManagement/ParkingList";
import EmployeeData from "./components/admin/DataManagement/EmployeeData";
import CustomerData from "./components/admin/DataManagement/CustomerData";
import ShuttleData from "./components/admin/DataManagement/ShuttleData";
import Register from "./Register";
import Verify from "./Verify";
import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<PrivateRoute />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

function PrivateRoute() {
  const { user } = useAuth();
  console.log("User in PrivateRoute:", user);
  return user ? <MainApp /> : <Navigate to="/login" replace />;
}

function MainApp() {
  const { user } = useAuth();
  console.log("User in MainApp:", user);
  return (
    <div className="app">
      {(user.role === "employee" || user.role === "manager") && <Sidebar />}
      <div className="main-content">
        <Routes>
          <Route path="/verify" element={<Verify />} />

          {/* Employee routes */}
          {(user.role === "employee" || user.role === "manager")  && (
            <>
              <Route path="/home" element={<Home />} />
              <Route path="/bookings/*" element={<Bookings />} />
              <Route path="/parking" element={<Parking />} />
              <Route path="/shuttle" element={<Shuttle />} />
              <Route path="/reports/revenue" element={<Revenue />} />
              <Route path="/reports/usage" element={<Usage />} />
              <Route path="/data-management/parkinglist" element={<ParkingList />} />
              <Route path="/data-management/employee" element={<EmployeeData />} />
              <Route path="/data-management/customer" element={<CustomerData />} />
              <Route path="/data-management/shuttle" element={<ShuttleData />} />
            </>
          )}

          {/* Customer routes */}
          {user.role === "customer" && (
            <>
              <Route path="/customer/booking" element={<Booking />} />
              <Route path="/customer/parking-data" element={<ParkingData />} />
              <Route path="/customer/request-shuttle" element={<RequestShuttle />} />
              <Route path="/customer/settings" element={<Settings />} />
              <Route path="/customer/settings/edit-profile" element={<EditProfile />} />
              <Route path="/customer/settings/parking-history" element={<ParkingHistory />} />
            </>
          )}

          {/* Default route based on user role */}
          <Route
            path="/"
            element={<Navigate to={user.role === "customer" ? "/customer/booking" : "/home"} replace />}
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
      {user.role === "customer" && <FooterBar />}
    </div>
  );
}

export default App;
