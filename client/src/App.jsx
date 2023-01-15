import React, { useState, useEffect } from 'react';
import EventCalendar from './Calendar/Calendar';
import Home from './Home/Home';
import { Button } from 'primereact/button';
import { Routes, Route } from 'react-router-dom';
import TabPatients from './Views/Tables/TabPatients';
import Patient from './Views/Patient';
import { Register } from './Auth/Register';
import { Login } from './Auth/Login';
import Statistics from './Views/Statistics';
import Add from './Views/Add';
import SidebarButton from './Sidebar/SidebarButton';
import './App.css';
import './styles/sidebar.css';
import '../node_modules/primeflex/primeflex.css';
import TabExaminations from './Views/Tables/TabExaminations';
import TabHospitalizations from './Views/Tables/TabHospitalizations';
import TabOperations from './Views/Tables/TabOperations';
import Storage from './Views/Storage';
import TabDoctorsOfHospital from './Views/Tables/TabDoctorsOfHospital';
import GetUserData from './Auth/GetUserData';
import Logout from './Auth/Logout';
import { useNavigate } from 'react-router-dom';
import Combobox from './Views/Combobox';
import Objednavka from './Views/Objednavka';

function App() {
  const [visibleLeft, setVisibleLeft] = useState(false);
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();
  const handleShowSidebar = () => {
    setVisibleLeft(!visibleLeft);
  };
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('user');
    const userDataHelper = GetUserData(token);
    setUserData(userDataHelper);
    if (
      typeof userDataHelper !== 'undefined' &&
      userDataHelper !== null &&
      userDataHelper.UserInfo.role === 3
    ) {
      const token = localStorage.getItem('user');
      const headers = { authorization: 'Bearer ' + token };
      fetch(`/patient/pacientId/${userDataHelper.UserInfo.userid}`, { headers })
        .then((response) => response.json())
        .then((data) => {
          setPatientId(data[0].ID_PACIENTA);
        });
    }
    if (userDataHelper === null) {
      navigate('/login');
    } else {
    }
  }, []);

  const sidebarButtonsAdmin = [
    <SidebarButton
      key='1'
      visibleLeft={visibleLeft}
      path='/'
      label='Domov'
      icon='home-icon'
    />,

    <SidebarButton
      key='8'
      visibleLeft={visibleLeft}
      path='/statistics'
      label='Štatistiky'
      icon='stat-icon'
    />,

    <SidebarButton
      key='10'
      visibleLeft={visibleLeft}
      path='/sklad'
      label='Sklad'
      icon='storage-icon'
    />,
    <SidebarButton
      key='11'
      visibleLeft={visibleLeft}
      path='/user'
      label='Meno usera'
      icon='user-icon'
    />,
    <SidebarButton
      key='13'
      visibleLeft={visibleLeft}
      path='/combobox'
      label='Admin selecty'
      icon='database-icon'
    />,
  ];

  const sidebarButtons = [
    <SidebarButton
      key='1'
      visibleLeft={visibleLeft}
      path='/'
      label='Domov'
      icon='home-icon'
    />,
    <SidebarButton
      key='2'
      visibleLeft={visibleLeft}
      path='/calendar'
      label='Kalendár'
      icon='calendar-icon'
    />,
    <SidebarButton
      key='3'
      visibleLeft={visibleLeft}
      path='/patients'
      label='Pacienti'
      icon='patient-icon'
    />,
    <SidebarButton
      key='5'
      visibleLeft={visibleLeft}
      path='/examinations'
      label='Vyšetrenia'
      icon='examination-icon'
    />,
    <SidebarButton
      key='6'
      visibleLeft={visibleLeft}
      path='/hospitalizations'
      icon='hospit-icon'
      label='Hospitalizácie'
    />,
    <SidebarButton
      key='7'
      visibleLeft={visibleLeft}
      path='/operations'
      label='Operácie'
      icon='operation-icon'
    />,
    <SidebarButton
      key='9'
      visibleLeft={visibleLeft}
      path='/add'
      label='Pridať udalosť'
      icon='plus-icon'
    />,
    <SidebarButton
      key='10'
      visibleLeft={visibleLeft}
      path='/sklad'
      label='Sklad'
      icon='storage-icon'
    />,
    <SidebarButton
      key='11'
      visibleLeft={visibleLeft}
      path='/user'
      label='Meno usera'
      icon='user-icon'
    />,
  ];
  const sidebarButtonsPatient = [
    <SidebarButton
      key='1'
      visibleLeft={visibleLeft}
      path='/'
      label='Domov'
      icon='home-icon'
    />,
    <SidebarButton
      key='2'
      visibleLeft={visibleLeft}
      path='/calendar'
      label='Kalendár'
      icon='calendar-icon'
    />,
    <SidebarButton
      key='3'
      visibleLeft={visibleLeft}
      path='/patient'
      label='Pacient'
      icon='patient-icon'
    />,
    <SidebarButton
      key='4'
      visibleLeft={visibleLeft}
      path='/objednavka'
      label='Objednavka'
      icon='patient-icon'
    />,
  ];

  const renderDoctorRoutes = () => {
    return (
      <>
        <Route
          path='/calendar'
          element={<EventCalendar userData={userData}></EventCalendar>}
        ></Route>
        <Route path='/patients' element={<TabPatients></TabPatients>}></Route>
        <Route
          path='/patient'
          element={
            <Patient patientId={patientId} userData={userData}></Patient>
          }
        ></Route>

        <Route
          path='/doctors'
          element={<TabDoctorsOfHospital></TabDoctorsOfHospital>}
        ></Route>
        <Route
          path='/examinations'
          element={<TabExaminations></TabExaminations>}
        ></Route>
        <Route
          path='/hospitalizations'
          element={<TabHospitalizations></TabHospitalizations>}
        ></Route>
        <Route
          path='/operations'
          element={<TabOperations></TabOperations>}
        ></Route>
        <Route path='/statistics' element={<Statistics></Statistics>}></Route>
        <Route path='/add' element={<Add></Add>}></Route>
        <Route path='/sklad' element={<Storage />}></Route>
      </>
    );
  };
  const renderAdminRoutes = () => {
    return (
      <>
        <Route path='/statistics' element={<Statistics></Statistics>}></Route>
        <Route path='/sklad' element={<Storage />}></Route>
        <Route path='/combobox' element={<Combobox />}></Route>
      </>
    );
  };

  const renderPatientRoutes = () => {
    return (
      <>
        <Route
          path='/calendar'
          element={<EventCalendar userData={userData}></EventCalendar>}
        ></Route>
        <Route
          path='/patient'
          element={
            <Patient userData={userData} patientId={patientId}></Patient>
          }
        ></Route>
        <Route
          path='/objednavka'
          element={
            <Objednavka userData={userData} patientId={patientId}></Objednavka>
          }
        ></Route>
      </>
    );
  };

  return (
    <div>
      <div className={`side-box ${visibleLeft ? 'side-box-opened' : ''}`}>
        <Button
          icon={`${visibleLeft ? 'pi pi-times' : 'pi pi-bars'}`}
          onClick={() => handleShowSidebar()}
          iconPos='right'
          style={{
            marginTop: '1rem',
            marginRight: '8px',
            marginLeft: 'auto',
            display: 'flex',
            background: 'none',
            border: 'none',
          }}
        />
        {typeof userData !== 'undefined' &&
          userData !== null &&
          userData.UserInfo.role === 1
          ? sidebarButtonsAdmin
          : userData !== null && userData.UserInfo.role === 2
            ? sidebarButtons
            : userData !== null && userData.UserInfo.role === 3
              ? sidebarButtonsPatient
              : ''}
        {typeof userData !== 'undefined' && userData !== null ? (
          <SidebarButton
            key='12'
            visibleLeft={visibleLeft}
            path='/logout'
            label='Odhlas'
            icon='logout-icon'
          />
        ) : (
          ''
        )}
      </div>
      <div
        className={`page-content ${visibleLeft ? 'page-content-opened' : ''}`}
      >
        <Routes>
          <Route path='/' element={<Home userData={userData}></Home>}></Route>
          <Route path='/register' element={<Register></Register>}></Route>
          <Route path='/login' element={<Login></Login>}></Route>
          <Route path='/logout' element={<Logout></Logout>}></Route>
          {typeof userData !== 'undefined' &&
            userData !== null &&
            userData.UserInfo.role === 1
            ? renderAdminRoutes()
            : typeof userData !== 'undefined' &&
              userData !== null &&
              userData.UserInfo.role === 2
              ? renderDoctorRoutes()
              : typeof userData !== 'undefined' &&
                userData !== null &&
                userData.UserInfo.role === 3
                ? renderPatientRoutes()
                : ''}
        </Routes>
      </div>
    </div>
  );
}

export default App;
