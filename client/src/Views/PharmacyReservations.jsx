import React from "react";
import HomeCard from "../Home/HomeCard";
import "../styles/homepage.css";
import reservationsIcon from "../images/reservations.png";

function PharmacyReservations() {
  const pharmacyStorageCards = [
    <HomeCard
      title="Rezervácie liekov"
      isCalendar={false}
      path="/medicaments_reservations"
      icon={reservationsIcon}
      key="30"
    ></HomeCard>,
    <HomeCard
      title="Rezervácie zdr. pomôcok"
      isCalendar={false}
      path="/medical_aids_reservations"
      icon={reservationsIcon}
      key="31"
    ></HomeCard>,
  ];

  const renderPharmacyReservationsCards = () => {
    return pharmacyStorageCards;
  };

  return <div>{renderPharmacyReservationsCards()}</div>;
}

export default PharmacyReservations;
