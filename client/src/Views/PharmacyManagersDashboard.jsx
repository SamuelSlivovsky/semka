import React from "react";
import AboutMeCard from "../Profile/AboutMeCard";
import PharmacyReportCard from "../Details/PharmacyReportCard";

function PharmacyManagersDashboard() {
  return (
    <div className="flex col-12">
      <AboutMeCard />
      <PharmacyReportCard />
    </div>
  );
}

export default PharmacyManagersDashboard;
