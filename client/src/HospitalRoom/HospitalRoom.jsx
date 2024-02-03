import React, { useState } from "react";
import Bed from "./Bed";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";

const HospitalRoom = () => {
  const [show, setShow] = useState(false);
  const [bedNumber, setBedNumber] = useState("");
  const handleBedClick = (bedNumber) => {
    setBedNumber(bedNumber);
    setShow(true);
    // You can implement custom logic for each bed click here
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2 style={{ textAlign: "center" }}>Miestnosť číslo 1</h2>
      <div
        style={{
          display: "grid",
          justifyItems: "center",
          gridTemplateColumns: "30% 30% 30%",
          width: "900px",
          minHeight: "600px",
          border: "10px solid black",
          gap: "4%",
          height: "fit-content",
          paddingBottom: "20px",
          marginBottom: "20px",
        }}
      >
        <Bed bedNumber={1} onClick={() => handleBedClick(1)} taken={true} />
        <Bed bedNumber={2} onClick={() => handleBedClick(2)} />
        <Bed bedNumber={3} onClick={() => handleBedClick(3)} />
        <Bed bedNumber={1} onClick={() => handleBedClick(1)} taken={true} />
        <Bed bedNumber={2} onClick={() => handleBedClick(2)} />
        <Bed bedNumber={3} onClick={() => handleBedClick(3)} />
      </div>
      <Dialog
        header={`Lôžko číslo ${bedNumber}`}
        style={{ width: "400px", height: "400px" }}
        blockScroll
        visible={show}
        onHide={() => {
          setShow(false);
        }}
        footer={<Button label="Karta pacienta"></Button>}
      >
        <h3>Oddelenie: Oddelenie </h3>
        <h3>Miestnost: Miestnost</h3>
        <h3>Obsadene </h3>
        <h3>Pacient: Meno Priezvisko</h3>
      </Dialog>
    </div>
  );
};

export default HospitalRoom;
