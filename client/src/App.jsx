import React, { useState } from "react";
import "./App.css";
import "./icons.css";
import EventCalendar from "./Calendar/Calendar";
import Home from "./Home/Home";
import { Button } from "primereact/button";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { Avatar } from "primereact/avatar";
import hospitalImage from "./images/hospital.png";
import Patients from "./Views/Patients";
import Patient from "./Views/Patient";
function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const [visibleLeft, setVisibleLeft] = useState(false);

  const handleShowSidebar = () => {
    setVisibleLeft(!visibleLeft);
  };

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <div>
      <div className={`side-box ${visibleLeft ? "side-box-opened" : ""}`}>
        <img
          src={hospitalImage}
          className={`hospital-logo ${
            location.pathname === "/" ? "hospital-logo-active" : ""
          }`}
          alt="logo"
          onClick={() => handleLogoClick()}
        ></img>
        <Button
          icon={`${visibleLeft ? "pi pi-arrow-left" : "pi pi-arrow-right"}`}
          onClick={() => handleShowSidebar()}
          className="mr-2"
          style={{
            marginTop: "1rem",
            marginRight: "8px",
            marginLeft: "auto",
            display: "block",
          }}
        />
        <Button
          icon="pi pi-user"
          className="p-button-rounded p-button-info"
          iconPos="right"
          style={{
            marginTop: "1rem",
            marginRight: "8px",
            marginLeft: "auto",
            display: "block",
          }}
        />
        <div className="sidebar-content">
          <h1 style={{ verticalAlign: "text-top", color: "white" }}>USER</h1>
          <Avatar label="P" className="mr-2" size="xlarge" shape="circle" />
        </div>
      </div>
      <div
        className={`page-content ${visibleLeft ? "page-content-opened" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Home></Home>}></Route>
          <Route
            path="/calendar"
            element={<EventCalendar></EventCalendar>}
          ></Route>
          <Route path="/patients" element={<Patients></Patients>}></Route>
          <Route path="/patient" element={<Patient></Patient>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
