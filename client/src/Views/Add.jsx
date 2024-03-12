import React, { useState, useRef } from "react";
import { SelectButton } from "primereact/selectbutton";
import { Toast } from "primereact/toast";
import PatientForm from "../Forms/PatientForm";
import RecipeForm from "../Forms/RecipeForm";
import HospitForm from "../Forms/HospitForm";
import OperationForm from "../Forms/OperationForm";
import ExaminationForm from "../Forms/ExaminationForm";
import MeetingForm from "../Forms/MeetingForm";
export default function Add() {
  const toast = useRef(null);
  const [eventTypeButton, setEventTypeButton] = useState(1);
  const eventTypes = [
    { name: "Operácia", code: "OP", value: 1 },
    { name: "Vyšetrenie", code: "EX", value: 2 },
    { name: "Hospitalizácia", code: "HOSP", value: 3 },
    { name: "Recept", code: "RECEPT", value: 4 },
    { name: "Pacient", code: "PAT", value: 5 },
    { name: "Konzílium", code: "MET", value: 6 },
  ];

  return (
    <div
      style={{ width: "90%", marginTop: "2rem" }}
      className="p-fluid grid formgrid"
    >
      <Toast ref={toast} />
      <div className="field col-12">
        <SelectButton
          value={eventTypeButton}
          options={eventTypes}
          onChange={(e) => setEventTypeButton(e.value)}
          optionLabel="name"
        />
      </div>
      {eventTypeButton === 1 ? (
        <OperationForm />
      ) : eventTypeButton === 2 ? (
        <ExaminationForm />
      ) : eventTypeButton === 3 ? (
        <HospitForm />
      ) : eventTypeButton === 4 ? (
        <RecipeForm />
      ) : eventTypeButton === 5 ? (
        <PatientForm />
      ) : (
        <MeetingForm />
      )}
    </div>
  );
}
