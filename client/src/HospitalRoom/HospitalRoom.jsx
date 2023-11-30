// HospitalRoom.js
import React from "react";
import Bed from "./Bed";

const HospitalRoom = () => {
  const handleBedClick = (bedNumber) => {
    alert(`Clicked on Bed ${bedNumber}`);
    // You can implement custom logic for each bed click here
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2 style={{ textAlign: "center" }}>Miestnosť číslo 1</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          width: "900px",
          height: "600px",
          border: "10px solid black",
        }}
      >
        <Bed bedNumber={1} onClick={() => handleBedClick(1)} taken={true} />
        <Bed bedNumber={2} onClick={() => handleBedClick(2)} />
        <Bed bedNumber={3} onClick={() => handleBedClick(3)} />
      </div>
    </div>
  );
};

export default HospitalRoom;
