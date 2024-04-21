import React from "react";
import AboutMeCard from "../Profile/AboutMeCard";
import PharmacyReportCard from "../Details/PharmacyReportCard";
import PharmacyEmployeeReportChartCard from "../Details/PharmacyEmployeeReportChartCard";
import PharmacyMedicationReportChartCard from "../Details/PharmacyMedicationReportChartCard";
import PharmacyMedicationReservationReportChartCard from "../Details/PharmacyMedicationReservationReportChartCard";
import PharmacyMedAidReservationReportChartCard from "../Details/PharmacyMedAidReservationReportChartCard";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";

function PharmacyManagersDashboard() {
  const navigate = useNavigate();

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na domovskú obrazovku"
          icon="pi pi-replay"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={() => navigate("/")}
        />
      </div>
    );
  };

  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {renderBackButton()}
      <div style={{ display: "flex", flexDirection: "row" }}>
        <AboutMeCard />
        <PharmacyReportCard />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <PharmacyEmployeeReportChartCard />
        <PharmacyMedicationReportChartCard />
      </div>
      <div style={{ display: "flex", flexDirection: "row" }}>
        <PharmacyMedicationReservationReportChartCard />
        <PharmacyMedAidReservationReportChartCard />
      </div>
    </div>
  );
}

export default PharmacyManagersDashboard;
