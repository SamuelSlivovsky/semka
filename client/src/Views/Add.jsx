import React, { useState } from "react";
import { Calendar } from "primereact/calendar";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { SelectButton } from "primereact/selectbutton";
import { Button } from "primereact/button";
export default function Add() {
  const [eventDateStart, setEventDateStart] = useState(null);
  const [eventDateEnd, setEventDateEnd] = useState(null);
  const [currRodCislo, setCurrRodCislo] = useState(null);
  const [eventTypeButton, setEventTypeButton] = useState(1);
  const [placeId, setPlaceId] = useState(null);
  const eventTypes = [
    { name: "Operácia", code: "OP", value: 1 },
    { name: "Vyšetrenie", code: "EX", value: 2 },
    { name: "Hospitalizácia", code: "HOSP", value: 3 },
    { name: "Recept", code: "RECEPT", value: 4 },
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
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        rod_cislo: currRodCislo,
        datum: eventDateStart,
        id_lekara: 1,
        id_lieku: placeId,
      }),
    };
    fetch("https://reqres.in/api/posts", requestOptions).then((response) =>
      response.json()
    );
  };
  return (
    <div
      style={{ width: "90%", marginTop: "2rem" }}
      className="p-fluid grid formgrid"
    >
      <div className="field col-4">
        <SelectButton
          value={eventTypeButton}
          options={eventTypes}
          onChange={(e) => setEventTypeButton(e.value)}
          optionLabel="name"
        />
      </div>
      <div className="field col-12">
        <label htmlFor="basic">Rodné číslo</label>
        <InputText
          value={currRodCislo !== null ? currRodCislo : ""}
          onChange={(e) => setCurrRodCislo(e.target.value)}
        />
      </div>
      <div className="field col-12 ">
        <label htmlFor="basic">Dátum zapísania receptu</label>
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
      <Button onClick={handleClick}></Button>
    </div>
  );
}
