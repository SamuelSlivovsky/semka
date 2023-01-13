import React, { useEffect, useState } from 'react';
import calendarIcon from '../images/calendar.png';
import patientIcon from '../images/patient.png';
import doctorsIcon from '../images/doctors.png';
import examinationIcon from '../images/examination.png';
import hospitalizationIcon from '../images/hospit.png';
import operationIcon from '../images/operation.png';
import plusIcon from '../images/plus.png';
import statIcon from '../images/statistics.png';
import HomeCard from './HomeCard';
import storageIcon from '../images/drugs.png';
import GetUserData from '../Auth/GetUserData';
import comboboxIcon from '../images/database.png';
import '../styles/homepage.css';

function Home() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem('user');
    setUserData(GetUserData(token));
  }, []);
  const cards = [
    <HomeCard
      title='Kalendár'
      isCalendar={true}
      path='/calendar'
      icon={calendarIcon}
      key='1'
    ></HomeCard>,
    <HomeCard
      title='Pacienti'
      isCalendar={false}
      path='/patients'
      icon={patientIcon}
      key='2'
    ></HomeCard>,
    <HomeCard
      title='Lekári'
      isCalendar={false}
      path='/doctors'
      icon={doctorsIcon}
      key='3'
    ></HomeCard>,
    <HomeCard
      title='Vyšetrenia'
      isCalendar={false}
      path='/examinations'
      icon={examinationIcon}
      key='4'
    ></HomeCard>,
    <HomeCard
      title='Hospitalizácie'
      isCalendar={false}
      path='/hospitalizations'
      icon={hospitalizationIcon}
      key='5'
    ></HomeCard>,
    <HomeCard
      title='Operácie'
      isCalendar={false}
      path='/operations'
      icon={operationIcon}
      key='6'
    ></HomeCard>,
    <HomeCard
      title='Štatistiky'
      isCalendar={false}
      path='/statistics'
      icon={statIcon}
      key='7'
    ></HomeCard>,
    <HomeCard
      title='Pridaj'
      isCalendar={false}
      path='/add'
      icon={plusIcon}
      key='8'
    ></HomeCard>,
    <HomeCard
      title='Sklad'
      isCalendar={false}
      path='/sklad'
      icon={storageIcon}
      key='9'
    ></HomeCard>,
  ];

  const adminCards = [
    <HomeCard
      title='Štatistiky'
      isCalendar={false}
      path='/statistics'
      icon={statIcon}
      key='7'
    ></HomeCard>,
    <HomeCard
      title='Databáza'
      isCalendar={false}
      path='/combobox'
      icon={comboboxIcon}
      key='2'
    ></HomeCard>,
    <HomeCard
      title='Sklad'
      isCalendar={false}
      path='/sklad'
      icon={storageIcon}
      key='9'
    ></HomeCard>,
  ];

  const patientCards = [
    <HomeCard
      title='Kalendár'
      isCalendar={true}
      path='/calendar'
      icon={calendarIcon}
      key='1'
    ></HomeCard>,
    <HomeCard
      title='Karta pacienta'
      isCalendar={false}
      path='/patient'
      icon={patientIcon}
      key='2'
    ></HomeCard>,
  ];

  return (
    <div>
      {userData !== null &&
      typeof userData !== 'undefined' &&
      userData.UserInfo.role === 1
        ? adminCards
        : userData !== null &&
          typeof userData !== 'undefined' &&
          userData.UserInfo.role === 2
        ? cards
        : userData !== null &&
          typeof userData !== 'undefined' &&
          userData.UserInfo.role === 3
        ? patientCards
        : ''}
    </div>
  );
}

export default Home;
