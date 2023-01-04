import React, { useState } from "react";
import EventCalendar from "./Calendar/Calendar";
import Home from "./Home/Home";
import { Button } from "primereact/button";
import { Routes, Route } from "react-router-dom";
import Patients from "./Views/Patients";
import Patient from "./Views/Patient";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import Doctors from "./Views/Doctors";
import Statistics from "./Views/Statistics";
import Add from "./Views/Add";
import SidebarButton from "./Sidebar/SidebarButton";
import "./App.css";
import "./styles/sidebar.css";
import "../node_modules/primeflex/primeflex.css";

function App() {
  const [visibleLeft, setVisibleLeft] = useState(false);
  const handleShowSidebar = () => {
    setVisibleLeft(!visibleLeft);
  };

  const sidebarButtons = [
    <SidebarButton
      key="1"
      visibleLeft={visibleLeft}
      path="/"
      label="Domov"
      icon="home-icon"
    />,
    <SidebarButton
      key="2"
      visibleLeft={visibleLeft}
      path="/calendar"
      label="Kalendár"
      icon="calendar-icon"
    />,
    <SidebarButton
      key="3"
      visibleLeft={visibleLeft}
      path="/patients"
      label="Pacienti"
      icon="patient-icon"
    />,
    <SidebarButton
      key="4"
      visibleLeft={visibleLeft}
      path="/doctors"
      label="Lekári"
      icon="doctor-icon"
    />,
    <SidebarButton
      key="5"
      visibleLeft={visibleLeft}
      path="/examinations"
      label="Vyšetrenia"
      icon="examination-icon"
    />,
    <SidebarButton
      key="6"
      visibleLeft={visibleLeft}
      path="/hospitalizations"
      icon="hospit-icon"
      label="Hospitalizácie"
    />,
    <SidebarButton
      key="7"
      visibleLeft={visibleLeft}
      path="/operations"
      label="Operácie"
      icon="operation-icon"
    />,
    <SidebarButton
      key="8"
      visibleLeft={visibleLeft}
      path="/statistics"
      label="Štatistiky"
      icon="stat-icon"
    />,
    <SidebarButton
      key="9"
      visibleLeft={visibleLeft}
      path="/add"
      label="Pridať udalosť"
      icon="plus-icon"
    />,
    <SidebarButton
      key="10"
      visibleLeft={visibleLeft}
      path="/user"
      label="Meno usera"
      icon="user-icon"
    />,
  ];

  return (
    <div>
      <div className={`side-box ${visibleLeft ? "side-box-opened" : ""}`}>
        <Button
          icon={`${visibleLeft ? "pi pi-times" : "pi pi-bars"}`}
          onClick={() => handleShowSidebar()}
          iconPos="right"
          style={{
            marginTop: "1rem",
            marginRight: "8px",
            marginLeft: "auto",
            display: "flex",
            background: "none",
            border: "none",
          }}
        />
        {sidebarButtons}
      </div>
      <div
        className={`page-content ${visibleLeft ? "page-content-opened" : ""}`}
      >
        <Routes>
          {<Route path="/" element={<Home></Home>}></Route>}
          <Route
            path="/calendar"
            element={<EventCalendar></EventCalendar>}
          ></Route>
          <Route path="/patients" element={<Patients></Patients>}></Route>
          <Route path="/patient" element={<Patient></Patient>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/doctors" element={<Doctors></Doctors>}></Route>
          <Route path="/statistics" element={<Statistics></Statistics>}></Route>
          <Route path="/add" element={<Add></Add>}></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
