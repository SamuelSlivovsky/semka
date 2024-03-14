import React, { useEffect, useState } from "react";
import calendarIcon from "../images/calendar.png";
import patientIcon from "../images/patient.png";
import doctorsIcon from "../images/doctors.png";
import examinationIcon from "../images/examination.png";
import hospitalizationIcon from "../images/hospit.png";
import operationIcon from "../images/operation.png";
import plusIcon from "../images/plus.png";
import statIcon from "../images/statistics.png";
import HomeCard from "./HomeCard";
import storageIcon from "../images/drugs.png";
import GetUserData from "../Auth/GetUserData";
import comboboxIcon from "../images/database.png";
import meetingIcon from "../images/meeting.png";
import bedIcon from "../images/bed.png";
import "../styles/homepage.css";

function Home() {
  const [userData, setUserData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    setUserData(GetUserData(token));
  }, []);
  const doctorCards = [
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
      title="Lôžka"
      isCalendar={false}
      path="/rooms"
      icon={bedIcon}
      key="13"
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
    ></HomeCard>,
    <HomeCard
      title="Konzíliá"
      isCalendar={false}
      path="/meetings"
      icon={meetingIcon}
      key="10"
    ></HomeCard>,
  ];

  const chiefCards = [
    <HomeCard
      title="Lekári"
      isCalendar={false}
      path="/doctors"
      icon={doctorsIcon}
      key="3"
    ></HomeCard>,
  ];

  const adminCards = [
    <HomeCard
      title="Štatistiky"
      isCalendar={false}
      path="/statistics"
      icon={statIcon}
      key="7"
    ></HomeCard>,
    <HomeCard
      title="Databáza"
      isCalendar={false}
      path="/combobox"
      icon={comboboxIcon}
      key="2"
    ></HomeCard>,
    <HomeCard
      title="Sklad"
      isCalendar={false}
      path="/sklad"
      icon={storageIcon}
      key="9"
    ></HomeCard>,
    <HomeCard
      title="Pacienti"
      isCalendar={false}
      path="/patients"
      icon={patientIcon}
      key="2"
    ></HomeCard>,
  ];

  const patientCards = [
    <HomeCard
      title="Kalendár"
      isCalendar={true}
      path="/calendar"
      icon={calendarIcon}
      key="1"
    ></HomeCard>,
    <HomeCard
      title="Karta pacienta"
      isCalendar={false}
      path="/patient"
      icon={patientIcon}
      key="2"
    ></HomeCard>,
  ];

  const renderHomeCards = () => {
    if (userData !== null && typeof userData !== "undefined") {
      if (userData.UserInfo.role === 0) return adminCards;
      else if (userData.UserInfo.role === 2) return doctorCards;
      else if (userData.UserInfo.role === 3)
        return (
          <>
            {doctorCards} {chiefCards}
          </>
        );
      else if (userData.UserInfo.role === 4) return patientCards;
    }
  };

  return <div>{renderHomeCards()}</div>;
}

export default Home;
