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
      title='Kalendár'
      isCalendar={false}
      path='/calendar'
      icon={patientIcon}
    ></HomeCard>,
    <HomeCard
      title='Kalendár'
      isCalendar={false}
      path='/calendar'
      icon={doctorsIcon}
    ></HomeCard>,
    <HomeCard
      title='Kalendár'
      isCalendar={false}
      path='/calendar'
      icon={examinationIcon}
    ></HomeCard>,
    <HomeCard
      title='Kalendár'
      isCalendar={false}
      path='/calendar'
      icon={hospitalizationIcon}
    ></HomeCard>,
    <HomeCard
      title='Kalendár'
      isCalendar={false}
      path='/calendar'
      icon={operationIcon}
    ></HomeCard>,
  ];

  return <div>{cards}</div>;
}

export default Home;
