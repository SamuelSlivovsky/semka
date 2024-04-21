import React from "react";
import HomeCard from "../Home/HomeCard";
import "../styles/homepage.css";
import freeSaleMedicamentsIcon from "../images/free_sale_medicaments.png";
import prescriptionsIcon from "../images/prescriptions.png";

function PharmacyDispensing() {
  const pharmacyDispensingCards = [
    <HomeCard
      title="Voľný predaj"
      isCalendar={false}
      path="/free_sale_medicaments"
      icon={freeSaleMedicamentsIcon}
      key="24"
    ></HomeCard>,
    <HomeCard
      title="Na recept"
      isCalendar={false}
      path="/prescriptions"
      icon={prescriptionsIcon}
      key="17"
    ></HomeCard>,
  ];

  const renderPharmacyDispensingCards = () => {
    return pharmacyDispensingCards;
  };

  return <div>{renderPharmacyDispensingCards()}</div>;
}

export default PharmacyDispensing;
