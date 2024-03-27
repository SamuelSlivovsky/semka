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
import warehouseIcon from "../images/warehouse.png";
import moveIcon from "../images/warehouse-move.png";
import orderIcon from "../images/order.png";
import pharmacyStorageIcon from "../images/pharmacy_storage.png";
import aboutMeIcon from "../images/about_me.png";
import pharmacyManagerIcon from "../images/pharmacist_manager.png";
import pharmacyEmployeeIcon from "../images/emloyee.png";
import dispensingMedicinesIcon from "../images/dispense_medicaments.png";
import medicamentsIcon from "../images/medicaments.png";
import medicalAidsIcon from "../images/medical_aids.png";
import reservationsIcon from "../images/reservations.png";
import GetUserData from "../Auth/GetUserData";
import comboboxIcon from "../images/database.png";
import meetingIcon from "../images/meeting.png";
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
      title="Admin Panel"
      isCalendar={false}
      path="/adminPanel"
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
      icon={storageIcon}
      key="2"
    ></HomeCard>,
  ];

  const warehouseCards = [
    <HomeCard
      title="Sklad"
      isCalendar={false}
      path="/sklad"
      icon={warehouseIcon}
      key="9"
    ></HomeCard>,
    <HomeCard
      title="Objednávky"
      isCalendar={false}
      path="/objednavky"
      icon={orderIcon}
      key="10"
    ></HomeCard>,
    <HomeCard
      title="Presuny"
      isCalendar={false}
      path="/presuny"
      icon={moveIcon}
      key="11"
    ></HomeCard>,
    <HomeCard
      title="Štatistiky skladu"
      isCalendar={false}
      path="/skladStatistiky"
      icon={statIcon}
      key="12"
    ></HomeCard>,
  ];

  const pharmacyManagerCards = [
    <HomeCard
      title="Informácie o mne"
      isCalendar={false}
      path="/about_me"
      icon={aboutMeIcon}
      key="20"
    ></HomeCard>,
    <HomeCard
      title="Číselník liekov"
      isCalendar={false}
      path="/medicaments"
      icon={medicamentsIcon}
      key="18"
    ></HomeCard>,
    <HomeCard
      title="Číselník zdravotníckych pomôcok"
      isCalendar={false}
      path="/medical_aids"
      icon={medicalAidsIcon}
      key="19"
    ></HomeCard>,
    <HomeCard
      title="Manažéri lekární na Slovensku"
      isCalendar={false}
      path="/pharmacy_managers"
      icon={pharmacyManagerIcon}
      key="15"
    ></HomeCard>,
    <HomeCard
      title="Zamestnanci lekárne"
      isCalendar={false}
      path="/pharmacy_employees"
      icon={pharmacyEmployeeIcon}
      key="22"
    ></HomeCard>,
    <HomeCard
      title="Sklad"
      isCalendar={false}
      path="/sklad"
      icon={warehouseIcon}
      key="9"
    ></HomeCard>,
    <HomeCard
      title="Objednávky"
      isCalendar={false}
      path="/objednavky"
      icon={orderIcon}
      key="10"
    ></HomeCard>,
    <HomeCard
      title="Presuny"
      isCalendar={false}
      path="/presuny"
      icon={moveIcon}
      key="11"
    ></HomeCard>,
    <HomeCard
      title="Lekárenský sklad"
      isCalendar={false}
      path="/lekarensky_sklad"
      icon={pharmacyStorageIcon}
      key="14"
    ></HomeCard>,
    <HomeCard
      title="Výdaj"
      isCalendar={false}
      path="/dispensing_medicines"
      icon={dispensingMedicinesIcon}
      key="23"
    ></HomeCard>,
    <HomeCard
      title="Rezervácie"
      isCalendar={false}
      path="/reservations"
      icon={reservationsIcon}
      key="21"
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
      else if (userData.UserInfo.role === 9999) return patientCards;
      else if (userData.UserInfo.role === 5) return warehouseCards;
      else if (userData.UserInfo.role === 10) return pharmacyManagerCards;
    }
  };

  return <div>{renderHomeCards()}</div>;
}

export default Home;
