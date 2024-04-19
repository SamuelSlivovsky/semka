import React, { useState, useEffect } from "react";
import Bed from "./Bed";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { useLocation, useNavigate } from "react-router";
import "../styles/room.css";
import {Toast} from "primereact/toast";


const toast = useRef(null);
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
      .then((res) => {
          if (res.ok) {
              return res.json();
              // Kontrola ci je token expirovany (status:410)
          } else if (res.status === 410) {
              // Token expiroval redirect na logout
              toast.current.show({
                  severity: "error",
                  summary: "Session timeout redirecting to login page",
                  life: 999999999,
              });
              setTimeout(() => {
                  navigate("/logout");
              }, 3000);
          }
      })
      .then((data) => {
        setSelectedBed({ ...bed, ...data[0] });
      });
  };

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`lekar/lozka/${location.state.id}`, { headers })
      .then((res) => {
          if (res.ok) {
              return res.json();
              // Kontrola ci je token expirovany (status:410)
          } else if (res.status === 410) {
              // Token expiroval redirect na logout
              toast.current.show({
                  severity: "error",
                  summary: "Session timeout redirecting to login page",
                  life: 999999999,
              });
              setTimeout(() => {
                  navigate("/logout");
              }, 3000);
          }
      })
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
          style={{display: "flex", flexDirection: "column", alignItems: "center"}}
      >
          <div><Toast ref={toast} position="top-center"/></div>
          <h2 style={{textAlign: "center"}}>Miestnosť {location.state.id}</h2>
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
                  position: "relative",
              }}
          >
              <div
                  style={{
                      zIndex: "9999",
                      position: "absolute",
                      left: location.state.door == "vpravo" ? "100%" : "-100px",
                      top: "35%",
                      width: "20px",
                      height: "200px",
                      backgroundColor: "white",
                  }}
              >
                  <div class="door">
                      <div
                          class="handle"
                          style={{
                              left: location.state.door == "vpravo" ? "80px" : "10px",
                          }}
                      ></div>
                  </div>
              </div>
              {beds}
          </div>
          <Dialog
              header={`Lôžko číslo ${selectedBed ? selectedBed.ID_LOZKA : ""}`}
              style={{width: "400px", height: "500px"}}
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
                                  ? navigate("/patient", {state: selectedBed.ID_PACIENTA})
                                  : ""
                          }
                      ></Button>
                  ) : (
                      ""
                  )
              }
          >
              <h3>Oddelenie: {selectedBed ? selectedBed.TYP_ODDELENIA : ""} </h3>
              <h3>Miestnost: {location.state.id}</h3>
              {selectedBed?.MENO ? (
                  <>
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
                  </>
              ) : (
                  ""
              )}
          </Dialog>
      </div>
  );
};

export default HospitalRoom;
