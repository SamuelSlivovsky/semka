import React, { useState, useEffect } from "react";
import Bed from "./Bed";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";

const HospitalRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [selectedBed, setSelectedBed] = useState(null);
  const [beds, setBeds] = useState([]);
  const handleBedClick = (bed) => {
    setShow(true);
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`lozko/pacient/${bed.ID_LOZKA}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setSelectedBed({ ...bed, ...data[0] });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`lekar/lozka/${location.state}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setBeds(
          data.map((item) => {
            return (
              <Bed
                bedNumber={item.ID_LOZKA}
                onClick={() => handleBedClick(item)}
                taken={item.OBSADENE == 1}
              />
            );
          })
        );
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <h2 style={{ textAlign: "center" }}>Miestnosť {location.state}</h2>
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
        {beds}
      </div>
      <Dialog
        header={`Lôžko číslo ${selectedBed ? selectedBed.ID_LOZKA : ""}`}
        style={{ width: "400px", height: "500px" }}
        blockScroll
        visible={show}
        onHide={() => {
          setShow(false);
          setSelectedBed(null);
        }}
        footer={
          selectedBed?.ID_PACIENTA ? (
            <Button
              label="Karta pacienta"
              onClick={() =>
                selectedBed
                  ? navigate("/patient", { state: selectedBed.ID_PACIENTA })
                  : ""
              }
            ></Button>
          ) : (
            ""
          )
        }
      >
        <h3>Oddelenie: {selectedBed ? selectedBed.TYP_ODDELENIA : ""} </h3>
        <h3>Miestnost: {location.state}</h3>
        <h3>
          Pacient:{" "}
          {selectedBed?.MENO
            ? `${selectedBed.MENO} ${selectedBed.PRIEZVISKO}`
            : ""}
        </h3>
        <h3>
          Rodné číslo: {selectedBed?.ROD_CISLO ? selectedBed.ROD_CISLO : ""}
        </h3>
        <h3>
          Dátum do:{" "}
          {selectedBed?.DAT_DO
            ? new Date(selectedBed.DAT_DO).toLocaleDateString("de", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
              })
            : "Neuvedený"}
        </h3>
      </Dialog>
    </div>
  );
};

export default HospitalRoom;
