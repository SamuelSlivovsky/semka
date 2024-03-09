import React from "react";
import HomeCard from "../Home/HomeCard";
import "../styles/homepage.css";
import pharmacistIcon from "../images/pharmacist.png";
import laborantIcon from "../images/laborant.png";

function PharmacyEmployees() {
  const pharmacyEmployeeCards = [
    <HomeCard
      title="Lekárnici"
      isCalendar={false}
      path="/pharmacists"
      icon={pharmacistIcon}
      key="16"
    ></HomeCard>,
    <HomeCard
      title="Laboranti"
      isCalendar={false}
      path="/laborants"
      icon={laborantIcon}
      key="23"
    ></HomeCard>,
  ];

  const renderPharmacyEmployeeCards = () => {
    return pharmacyEmployeeCards;
  };

  return <div>{renderPharmacyEmployeeCards()}</div>;
}

export default PharmacyEmployees;
