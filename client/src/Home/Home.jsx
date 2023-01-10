import React from "react";
import calendarIcon from "../images/calendar.png";
import patientIcon from "../images/patient.png";
import doctorsIcon from "../images/doctors.png";
import examinationIcon from "../images/examination.png";
import hospitalizationIcon from "../images/hospit.png";
import operationIcon from "../images/operation.png";
import plusIcon from "../images/plus.png";
import statIcon from "../images/statistics.png";
import HomeCard from "./HomeCard";
import storageIcon from "../images/drugs.png"
import "../styles/homepage.css";

function Home() {
  const cards = [
    <HomeCard
      title="Kalendár"
      isCalendar={true}
      path="/calendar"
      icon={calendarIcon}
      key="1"
    ></HomeCard>,
    <HomeCard
      title="Pacienti"
      isCalendar={false}
      path="/patients"
      icon={patientIcon}
      key="2"
    ></HomeCard>,
    <HomeCard
      title="Lekári"
      isCalendar={false}
      path="/doctors"
      icon={doctorsIcon}
      key="3"
    ></HomeCard>,
    <HomeCard
      title="Vyšetrenia"
      isCalendar={false}
      path="/examinations"
      icon={examinationIcon}
      key="4"
    ></HomeCard>,
    <HomeCard
      title="Hospitalizácie"
      isCalendar={false}
      path="/hospitalizations"
      icon={hospitalizationIcon}
      key="5"
    ></HomeCard>,
    <HomeCard
      title="Operácie"
      isCalendar={false}
      path="/operations"
      icon={operationIcon}
      key="6"
    ></HomeCard>,
    <HomeCard
      title="Štatistiky"
      isCalendar={false}
      path="/statistics"
      icon={statIcon}
      key="7"
    ></HomeCard>,
    <HomeCard
      title="Pridaj"
      isCalendar={false}
      path="/add"
      icon={plusIcon}
      key="8"
    ></HomeCard>,
    <HomeCard
      title="Sklad"
      isCalendar={false}
      path="/sklad"
      icon={storageIcon}
      key="9"
    ></HomeCard>
  ];

  return <div>{cards}</div>;
}

export default Home;
