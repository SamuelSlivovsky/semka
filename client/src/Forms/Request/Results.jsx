import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import GetUserData from "../../Auth/GetUserData";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import {Toast} from "primereact/toast";


const toast = useRef(null);
export default function Results() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [patient, setPatient] = useState(null);
  const [patientData, setPatientData] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (response.status === 410) {
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
        .then((response) => {
          if (response.ok) {
            return response.json();
            // Kontrola ci je token expirovany (status:410)
          } else if (response.status === 410) {
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
          console.log(patient);
          return (
            patient.ROD_CISLO.toLowerCase().startsWith(
              event.query.toLowerCase()
            ) ||
            patient.MENO.toLowerCase().startsWith(event.query.toLowerCase()) ||
            patient.PRIEZVISKO.toLowerCase().startsWith(
              event.query.toLowerCase()
            )
          );
        });
      }

      setFilteredPatients(_filtered);
    }, 250);
  };
  const itemTemplate = (rowData) => {
    return (
      <span>
        {rowData.ROD_CISLO} - {rowData.MENO}, {rowData.PRIEZVISKO}
      </span>
    );
  };

  const handleDownload = () => {
    const queryString = new URLSearchParams({
      name: patientData.MENO,
      surname: patientData.PRIEZVISKO,
    }).toString();

    window.open(`/add/resultsPdf?${queryString}`, "_blank");
  };

  return (
      <div
          style={{width: "100%", marginTop: "2rem", marginLeft: "10px"}}
          className="p-fluid grid formgrid"
      >
        <div><Toast ref={toast} position="top-center"/></div>
        <div className="field col-12">
          <div className="field col-12">
            <label htmlFor="rod_cislo">Rodné číslo*</label>
            <AutoComplete
                value={patient}
                onChange={(e) => {
                  setPatient(e.value);
                }}
                itemTemplate={itemTemplate}
                field="REQUESTNAME"
                suggestions={filteredPatients}
                completeMethod={searchPatient}
                dropdown
            />
          </div>
        </div>
        <Button label="Stiahnuť" onClick={() => handleDownload()}/>
      </div>
  );
}
