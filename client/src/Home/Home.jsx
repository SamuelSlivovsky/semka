import React from 'react';
import calendarIcon from '../images/calendar.png';
import patientIcon from '../images/patient.png';
import doctorsIcon from '../images/doctors.png';
import examinationIcon from '../images/examination.png';
import hospitalizationIcon from '../images/hospit.png';
import operationIcon from '../images/operation.png';
import HomeCard from './HomeCard';
import '../styles/homepage.css';

function Home() {
  const cards = [
    <HomeCard
      title='Kalendár'
      isCalendar={true}
      path='/calendar'
      icon={calendarIcon}
    ></HomeCard>,
    <HomeCard
      title='Pacienti'
      isCalendar={false}
      path='/patients'
      icon={patientIcon}
    ></HomeCard>,
    <HomeCard
      title='Lekári'
      isCalendar={false}
      path='/doctors'
      icon={doctorsIcon}
    ></HomeCard>,
    <HomeCard
      title='Vyšetrenia'
      isCalendar={false}
      path='/examinations'
      icon={examinationIcon}
    ></HomeCard>,
    <HomeCard
      title='Hospitalizácie'
      isCalendar={false}
      path='/hospitalizations'
      icon={hospitalizationIcon}
    ></HomeCard>,
    <HomeCard
      title='Operácie'
      isCalendar={false}
      path='/operations'
      icon={operationIcon}
    ></HomeCard>,
  ];

  return <div>{cards}</div>;
}

export default Home;
