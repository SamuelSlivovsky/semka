import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { AutoComplete } from "primereact/autocomplete";
import { PDFDownloadLink, PDFViewer } from "@react-pdf/renderer";
import { Pdf } from "./PdfResult";
import GetUserData from "../../Auth/GetUserData";

export default function Basic() {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [reason, setReason] = useState(null);
  const [patient, setPatient] = useState(null);
  const [myDoc, setMyDoc] = useState(null);

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
        .then((data) => {});
    }
  }, [patient, reason]); // Update when patient or reason changes

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

        <div className="field col-12">
          <label htmlFor="dovod">Dôvod*</label>
          <InputText
            id="dovod"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
          />
          <PDFDownloadLink
            style={{
              height: "40px",
              backgroundColor: "#14B8A6",
              width: "100%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              borderRadius: "5px",
              textDecoration: "none",
              marginBottom: "10px",
              margin: "10px",
            }}
            document={<Pdf data={{ MENO: "dssdsdsd" }} reason={"dssdsdsdsd"} />}
            fileName={`ziadanka.pdf`}
          >
            {({ loading }) =>
              loading ? (
                "Načítavam"
              ) : (
                <span
                  style={{
                    fontWeight: "bold",
                    color: "white",
                    display: "flex",
                    gap: "10px",
                  }}
                >
                  {" "}
                  <i
                    className="pi pi-file-pdf"
                    style={{ fontSize: "20px" }}
                  ></i>
                  Stiahnuť
                </span>
              )
            }
          </PDFDownloadLink>
        </div>
      </div>
    </div>
  );
}
