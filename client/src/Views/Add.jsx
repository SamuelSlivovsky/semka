import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { InputNumber } from "primereact/inputnumber";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
export default function Add() {
  const [eventDateStart, setEventDateStart] = useState(null);
  const [eventDateEnd, setEventDateEnd] = useState(null);
  const [currRodCislo, setCurrRodCislo] = useState(null);
  const [patientName, setPatientName] = useState("");
  const [patientSurname, setPatientSurname] = useState("");
  const [patientPhone, setPatientPhone] = useState("");
  const [patientMail, setPatientMail] = useState("");
  const [currPsc, setCurrPsc] = useState(null);
  const [eventTypeButton, setEventTypeButton] = useState(1);
  const [placeId, setPlaceId] = useState(null);
  const eventTypes = [
    { name: "Operácia", code: "OP", value: 1 },
    { name: "Vyšetrenie", code: "EX", value: 2 },
    { name: "Hospitalizácia", code: "HOSP", value: 3 },
    { name: "Recept", code: "RECEPT", value: 4 },
    { name: "Pacient", code: "PAT", value: 5 },
  ];
  const placesId = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  const onPlaceIdChange = (e) => {
    setPlaceId(e.value);
  };

  const handleClick = () => {
    insertData();
  };

  async function insertData() {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rod_cislo: currRodCislo,
        datum: eventDateStart.toLocaleString("en-GB").replace(",", ""),
        id_lekara: 1,
        id_lieku: placeId.id,
        datum_vyzdvihnutia: eventDateEnd,
      }),
    };
    const response = await fetch("/recept/recept", requestOptions);
    const data = await response.json();
  }

  const renderAddPatientContent = () => {
    return (
      <>
        <div className="field col-12">
          <label htmlFor="basic">Meno</label>
          <InputText
            value={patientName !== null ? patientName : ""}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className="field col-12">
          <label htmlFor="basic">Priezvisko</label>
          <InputText
            value={patientSurname !== null ? patientSurname : ""}
            onChange={(e) => setPatientSurname(e.target.value)}
          />
        </div>
        <div className="field col-12">
          <label htmlFor="basic">Rodné číslo</label>
          <InputMask
            value={currRodCislo !== null ? currRodCislo : ""}
            onChange={(e) => setCurrRodCislo(e.target.value)}
            mask="999999/9999"
            placeholder="900101/0101"
          />
        </div>
        <div className="field col-12">
          <label htmlFor="basic">PSČ</label>
          <InputMask
            value={currPsc !== null ? currPsc : ""}
            onChange={(e) => setCurrPsc(e.target.value)}
            mask="99999"
            placeholder="99999"
          />
        </div>
        <div className="field col-12">
          <label htmlFor="basic">Telefón</label>
          <InputMask
            value={patientPhone !== null ? patientPhone : ""}
            onChange={(e) => setPatientPhone(e.target.value)}
            mask="+421999999999"
            placeholder="+421919121121"
          />
        </div>
        <div className="field col-12">
          <label htmlFor="basic">E-mail</label>
          <InputText
            value={patientMail !== null ? patientMail : ""}
            onChange={(e) => setPatientMail(e.target.value)}
            pattern=" /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i"
          />
        </div>
      </>
    );
  };

  return (
    <div
      style={{ width: "90%", marginTop: "2rem" }}
      className="p-fluid grid formgrid"
    >
      <div className="field col-6">
        <SelectButton
          value={eventTypeButton}
          options={eventTypes}
          onChange={(e) => setEventTypeButton(e.value)}
          optionLabel="name"
        />
      </div>
      {eventTypeButton === 5 ? (
        renderAddPatientContent()
      ) : (
        <>
          <div className="field col-12">
            <label htmlFor="basic">Rodné číslo</label>
            <InputMask
              value={currRodCislo !== null ? currRodCislo : ""}
              onChange={(e) => setCurrRodCislo(e.target.value)}
              mask="999999/9999"
              placeholder="900101/0101"
            />
          </div>
          <div className="field col-12 ">
            <label htmlFor="basic">Dátum</label>
            <Calendar
              id="basic"
              value={eventDateStart}
              onChange={(e) => setEventDateStart(e.value)}
              showTime
              showIcon
              dateFormat="dd.mm.yy"
            />
          </div>
          <div className="field col-12 ">
            <label htmlFor="basic">Id lieku</label>
            <Dropdown
              value={placeId}
              options={placesId}
              onChange={onPlaceIdChange}
              optionLabel="id"
            />
          </div>
        </>
      )}
      <Button onClick={handleClick}></Button>
    </div>
  );
}
