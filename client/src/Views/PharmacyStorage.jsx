import React from "react";
import HomeCard from "../Home/HomeCard";
import "../styles/homepage.css";
import medicamentsIcon from "../images/medicaments.png";
import medicalAidsIcon from "../images/medical_aids.png";
import searchIcon from "../images/search.png";

function PharmacyStorage() {
  const pharmacyStorageCards = [
    <HomeCard
      title="Lieky v lekárenskom sklade"
      isCalendar={false}
      path="/lekarensky_sklad_lieky"
      icon={medicamentsIcon}
      key="18"
    ></HomeCard>,
    <HomeCard
      title="Zravotnícke pomôcky v lekárenskom sklade"
      isCalendar={false}
      path="/lekarensky_sklad_zdravotnickePomocky"
      icon={medicalAidsIcon}
      key="19"
    ></HomeCard>,
    <HomeCard
      title="Vyhľadávanie lieku podľa lekární"
      isCalendar={false}
      path="/lekarensky_sklad_vyhladavanieLiecivaPodlaLekarni"
      icon={searchIcon}
      key="20"
    ></HomeCard>,
    <HomeCard
      title="Vyhľadávanie zdr. pomôcky podľa lekární"
      isCalendar={false}
      path="/lekarensky_sklad_vyhladavanieZdrPomockyPodlaLekarni"
      icon={searchIcon}
      key="21"
    ></HomeCard>,
  ];

  const renderPharmacyStorageCards = () => {
    return pharmacyStorageCards;
  };

  return <div>{renderPharmacyStorageCards()}</div>;
}

export default PharmacyStorage;
