import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import GetUserData from "../../Auth/GetUserData";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";

export default function Mandate() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [reason, setReason] = useState(null);
  const [patient, setPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
      });
  }, []);

  useEffect(() => {
    if (patient) {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      fetch(`/patient/info/${patient.ID_PACIENTA}`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setPatientData(...data);
        });
    }
  }, [patient]);

  const searchPatient = (event) => {
    setTimeout(() => {
      let _filtered;
      if (!event.query.trim().length) {
        _filtered = [...patients];
      } else {
        _filtered = patients.filter((patient) => {
          return patient.ROD_CISLO.toLowerCase().startsWith(
            event.query.toLowerCase()
          );
        });
      }

      setFilteredPatients(_filtered);
    }, 250);
  };

  const handleDownload = () => {
    const queryString = new URLSearchParams({
      name: patientData.MENO,
      surname: patientData.PRIEZVISKO,
      birthId: patientData.ROD_CISLO,
      insurance: patientData.NAZOV_POISTOVNE,
      city: patientData.NAZOV_OBCE,
      age: patientData.VEK,
      PSC: patientData.PSC,
      dateOfBirth: patientData.DATUM_NARODENIA,
    }).toString();

    window.open(`/add/mandatePdf?${queryString}`, "_blank");
  };

  return (
    <div
      style={{ width: "100%", marginTop: "2rem", marginLeft: "10px" }}
      className="p-fluid grid formgrid"
    >
      <div className="field col-12">
        <div className="field col-12">
          <label htmlFor="rod_cislo">Rodné číslo*</label>
          <AutoComplete
            value={patient}
            onChange={(e) => setPatient(e.value)}
            field="ROD_CISLO"
            suggestions={filteredPatients}
            completeMethod={searchPatient}
            dropdown
          />
        </div>
      </div>
      <Button label="Stiahnuť" onClick={() => handleDownload()} />
    </div>
  );
}
