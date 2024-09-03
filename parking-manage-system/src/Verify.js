import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import { useAuth } from "./context/AuthContext";

function Verify() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    const token = localStorage.getItem("jwt");
    if (token) {
      axios
        .get("http://localhost:5000/api/verify-token", {
          headers: {
            authorization: token,
          },
        })
        .then((response) => {
          console.log("Raw API response:", response.data);
          const userData = response.data.user;
          console.log("User data from API:", userData);

          if (!userData) {
            console.error("User data is undefined");
            navigate("/login");
            return;
          }

          let formattedUserData = null;

          if (userData.Officer_ID !== undefined) {
            formattedUserData = {
              id: userData.Officer_ID,
              fname: userData.Officer_Fname,
              lname: userData.Officer_Lname,
              username: userData.Officer_Username,
              password: userData.Officer_Password,
              tel: userData.Officer_Tel,
              role: userData.Role, // Ensure role is included for employees
            };
          } else if (userData.Customer_ID !== undefined) {
            formattedUserData = {
              id: userData.Customer_ID,
              fname: userData.Customer_Fname,
              lname: userData.Customer_Lname,
              username: userData.Customer_Username,
              password: userData.Customer_Password,
              tel: userData.Customer_Tel,
              role: "customer",
            };
          } else {
            console.error("Invalid user data structure");
            navigate("/login");
            return;
          }

          console.log("Formatted User Data:", formattedUserData);
          setUser(formattedUserData);
          console.log("User set in AuthContext:", formattedUserData);

          if (formattedUserData.role === 'employee'||formattedUserData.role === 'manager') {
            navigate("/home");
          } else if (formattedUserData.role === 'customer') {
            navigate("/customer/booking");
          } else {
            console.error("Unknown user role:", formattedUserData.role);
            navigate("/login");
          }
        })
        .catch((error) => {
          console.error("Token verification failed", error);
          localStorage.removeItem("jwt");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [navigate, setUser]);

  return null;
}

export default Verify;
