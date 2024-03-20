import React from "react";
import AboutMeCard from "../Profile/AboutMeCard";
import PharmacyReportCard from "../Details/PharmacyReportCard";
import PharmacyReportChartCard from "../Details/PharmacyReportChartCard";

function PharmacyManagersDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <AboutMeCard />
        <PharmacyReportCard />
      </div>
      <PharmacyReportChartCard />
    </div>
  );
}

export default PharmacyManagersDashboard;
