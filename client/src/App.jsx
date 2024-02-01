import React, { useState, useEffect } from "react";
import EventCalendar from "./Calendar/Calendar";
import Home from "./Home/Home";
import { Button } from "primereact/button";
import { Routes, Route } from "react-router-dom";
import TabPatients from "./Views/Tables/TabPatients";
import Patient from "./Views/Patient";
import { Register } from "./Auth/Register";
import { Login } from "./Auth/Login";
import Statistics from "./Views/Statistics";
import Add from "./Views/Add";
import SidebarButton from "./Sidebar/SidebarButton";
import "./App.css";
import "./styles/sidebar.css";
import "../node_modules/primeflex/primeflex.css";
import TabExaminations from "./Views/Tables/TabExaminations";
import TabHospitalizations from "./Views/Tables/TabHospitalizations";
import TabOperations from "./Views/Tables/TabOperations";
import Storage from "./Views/Storage";
import PharmacyStorage from "./Views/PharmacyStorage";
import TabDoctorsOfHospital from "./Views/Tables/TabDoctorsOfHospital";
import GetUserData from "./Auth/GetUserData";
import Logout from "./Auth/Logout";
import { useNavigate, useLocation } from "react-router-dom";
import Combobox from "./Views/Combobox";
import DoctorCard from "./Profile/DoctorCard";
import Equipment from "./Views/Equipment";
import User from "./Views/User";
import HospitalRoom from "./HospitalRoom/HospitalRoom";
import TabMeetings from "./Views/Tables/TabMeetings";
import socketService from "./service/socketService";
function App() {
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const [notifications, setNotifications] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const handleShowSidebar = () => {
    setVisibleLeft(!visibleLeft);
  };
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);

    setUserData(userDataHelper);
    if (typeof userDataHelper !== "undefined" && userDataHelper !== null) {
      const headers = { authorization: "Bearer " + token };
      if (userDataHelper.UserInfo.role === 4) {
        fetch(`/patient/pacientId/${userDataHelper.UserInfo.userid}`, {
          headers,
        })
          .then((response) => response.json())
          .then((data) => {
            setPatientId(data[0].ID_PACIENTA);
          });
      } else {
        fetch(`/chat/unread/${userDataHelper.UserInfo.userid}`, {
          headers,
        })
          .then((res) => res.json())
          .then((data) => setNotifications(data.POCET));
      }
    } else if (location.pathname !== "/register") {
      navigate("/login");
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    socketService.connect();
    socketService.on("newMessage", (message) => {
      fetch(`/chat/unread/${userDataHelper.UserInfo.userid}`, {
        headers,
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          setNotifications(data.POCET);
        });
    });

    return () => {
      socketService.disconnect();
    };
  }, [location.pathname]);

  const sidebarButtonsAdmin = [
    <SidebarButton
      key="1"
      visibleLeft={visibleLeft}
      path="/"
      label="Domov"
      icon="home-icon"
    />,
    <SidebarButton
      key="3"
      visibleLeft={visibleLeft}
      path="/patients"
      label="Pacienti"
      icon="patient-icon"
    />,

    <SidebarButton
      key="8"
      visibleLeft={visibleLeft}
      path="/statistics"
      label="Štatistiky"
      icon="stat-icon"
    />,

    <SidebarButton
      key="10"
      visibleLeft={visibleLeft}
      path="/sklad"
      label="Sklad"
      icon="storage-icon"
    />,
    <SidebarButton
      key="13"
      visibleLeft={visibleLeft}
      path="/combobox"
      label="Admin selecty"
      icon="database-icon"
    />,
  ];

  const sidebarButtonsDoctor = [
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
      key="9"
      visibleLeft={visibleLeft}
      path="/add"
      label="Pridať udalosť"
      icon="plus-icon"
    />,
    <SidebarButton
      key="10"
      visibleLeft={visibleLeft}
      path="/sklad"
      label="Sklad"
      icon="storage-icon"
    />,
    <SidebarButton
      key="13"
      visibleLeft={visibleLeft}
      path="/statistics"
      label="Štatistiky"
      icon="stat-icon"
    />,
    <SidebarButton
      key="11"
      visibleLeft={visibleLeft}
      path="/user"
      label="Meno usera"
      icon="user-icon"
    />,
    <SidebarButton
      key="12"
      visibleLeft={visibleLeft}
      path="/meetings"
      label="Konzíliá"
      icon="meeting-icon"
    />,
  ];

  const sidebarButtonsChief = [
    <SidebarButton
      key="4"
      visibleLeft={visibleLeft}
      path="/doctors"
      label="Lekári"
      icon="doctor-icon"
    />,
  ];

  const sidebarButtonsPatient = [
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
      path="/patient"
      label="Pacient"
      icon="patient-icon"
    />,
  ];

  const sidebarButtonsPharmacyManager = [
    <SidebarButton
      key="1"
      visibleLeft={visibleLeft}
      path="/"
      label="Domov"
      icon="home-icon"
    />,
    <SidebarButton
      key="3"
      visibleLeft={visibleLeft}
      path="/patients"
      label="Pacienti"
      icon="patient-icon"
  />,
    <SidebarButton
    key="10"
    visibleLeft={visibleLeft}
    path="/sklad"
    label="Sklad"
    icon="storage-icon"
  />,  
    <SidebarButton
      key="14"
      visibleLeft={visibleLeft}
      path="/lekarensky_sklad"
      label="Lekárenský sklad"
      icon="pharmacy-storage-icon"
  />,  
    <SidebarButton
      key="15"
      visibleLeft={visibleLeft}
      path="/pharmacy_managers"
      label="Manažéri lekární"
      icon="pharmacy-manager-icon"
  />,  
    <SidebarButton
      key="16"
      visibleLeft={visibleLeft}
      path="/pharmacists"
      label="Lekárnici"
      icon="pharmacist-icon"
  />,  
  ];

  const renderDoctorRoutes = () => {
    return (
      <>
        <Route
          path="/calendar"
          element={<EventCalendar userData={userData}></EventCalendar>}
        ></Route>
        <Route path="/patients" element={<TabPatients></TabPatients>}></Route>
        <Route
          path="/patient"
          element={
            <Patient patientId={patientId} userData={userData}></Patient>
          }
        ></Route>
        <Route
          path="/examinations"
          element={<TabExaminations></TabExaminations>}
        ></Route>
        <Route
          path="/hospitalizations"
          element={<TabHospitalizations></TabHospitalizations>}
        ></Route>
        <Route
          path="/operations"
          element={<TabOperations></TabOperations>}
        ></Route>
        <Route path="/statistics" element={<Statistics></Statistics>}></Route>
        <Route path="/add" element={<Add></Add>}></Route>
        <Route path="/sklad" element={<Storage />}></Route>
        <Route path="/meetings" element={<TabMeetings />}></Route>
      </>
    );
  };

  const renderChiefRoutes = () => {
    return (
      <>
        <Route
          path="/doctors"
          element={<TabDoctorsOfHospital></TabDoctorsOfHospital>}
        ></Route>
        <Route path="/doctor" element={<DoctorCard></DoctorCard>}></Route>
        <Route path="/equipment" element={<Equipment></Equipment>}></Route>
      </>
    );
  };
  const renderAdminRoutes = () => {
    return (
      <>
        <Route path="/statistics" element={<Statistics></Statistics>}></Route>
        <Route path="/patients" element={<TabPatients></TabPatients>}></Route>
        <Route path="/sklad" element={<Storage />}></Route>
        <Route path="/combobox" element={<Combobox />}></Route>
      </>
    );
  };

  const renderPatientRoutes = () => {
    return (
      <>
        <Route
          path="/calendar"
          element={<EventCalendar userData={userData}></EventCalendar>}
        ></Route>
        <Route
          path="/patient"
          element={
            <Patient userData={userData} patientId={patientId}></Patient>
          }
        ></Route>
      </>
    );
  };

  const renderPharmacyManagerRoutes = () => {
    return (
      <>
          <Route path="/lekarensky_sklad" element={<PharmacyStorage />}></Route>
      </>
    );
  };

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
        {typeof userData !== "undefined" &&
        userData !== null &&
        userData.UserInfo.role === 0 ? (
          sidebarButtonsAdmin
        ) : userData !== null && userData.UserInfo.role === 2 ? (
          sidebarButtonsDoctor
        ) : userData !== null && userData.UserInfo.role === 3 ? (
          <>
            {sidebarButtonsDoctor} {sidebarButtonsChief}
          </>
        ) : userData !== null && userData.UserInfo.role === 4 ? (
          sidebarButtonsPatient
        ) : userData !== null && userData.UserInfo.role === 10 ? (
          sidebarButtonsPharmacyManager  
        ) : (
          ""
        )}
        {typeof userData !== "undefined" && userData !== null ? (
          <>
            {" "}
            <SidebarButton
              key="11"
              visibleLeft={visibleLeft}
              path="/user"
              label="Správy"
              icon="chat-icon"
              notifications={notifications}
            />{" "}
            <SidebarButton
              key="12"
              visibleLeft={visibleLeft}
              path="/logout"
              label="Odhlas"
              icon="logout-icon"
            />
          </>
        ) : (
          ""
        )}
      </div>
      <div
        className={`page-content ${visibleLeft ? "page-content-opened" : ""}`}
      >
        <Routes>
          <Route path="/" element={<Home userData={userData}></Home>}></Route>
          <Route path="/register" element={<Register></Register>}></Route>
          <Route path="/login" element={<Login></Login>}></Route>
          <Route path="/logout" element={<Logout></Logout>}></Route>
          <Route path="/user" element={<User></User>}></Route>
          <Route path="/room" element={<HospitalRoom />}></Route>
          {userData && userData.UserInfo.role === 0 ? (
            renderAdminRoutes()
          ) : userData && userData.UserInfo.role === 2 ? (
            renderDoctorRoutes()
          ) : userData && userData.UserInfo.role === 3 ? (
            <>
              {renderChiefRoutes()} {renderDoctorRoutes()}
            </>
          ) : userData && userData.UserInfo.role === 4 ? (
            renderPatientRoutes()
          ) : userData && userData.UserInfo.role === 10 ? (
            renderPharmacyManagerRoutes()
          ) : (
            ""
          )}
        </Routes>
      </div>
    </div>
  );
}

export default App;
