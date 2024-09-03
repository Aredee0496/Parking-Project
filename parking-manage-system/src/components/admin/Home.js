import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

function Home() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/verify"); 
    }else{
      console.log(user)
    }
  }, [user, navigate]);
  console.log("eiei", user);

  return (
    <div>
      <h1>หน้าแรก</h1>
      <div>
        <p>iD: {user?.id}</p>
        <p>บทบาท: {user?.role}</p>
      </div>
    </div>
  );
}

export default Home;
