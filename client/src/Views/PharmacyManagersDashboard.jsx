import React from "react";
import AboutMeCard from "../Profile/AboutMeCard";
import PharmacyReportCard from "../Details/PharmacyReportCard";
import PharmacyEmployeeReportChartCard from "../Details/PharmacyEmployeeReportChartCard";
import PharmacyMedicationReportChartCard from "../Details/PharmacyMedicationReportChartCard";

function PharmacyManagersDashboard() {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <AboutMeCard />
        <PharmacyReportCard />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <PharmacyEmployeeReportChartCard />
        <PharmacyMedicationReportChartCard />
      </div>
    </div>
  );
}

export default PharmacyManagersDashboard;
