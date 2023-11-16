import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useLocation } from "react-router";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import HospitForm from "../Forms/HospitForm";
//import RecipeForm from '../Forms/RecipeForm';
import OperationForm from "../Forms/OperationForm";
import ExaminationForm from "../Forms/ExaminationForm";
import TableMedicalRecords from "../Views/Tables/TableMedicalRecords";
import "../icons.css";
import DiseaseForm from "../Forms/DiseaseForm";
import DisablesForm from "../Forms/DisablesForm";

export default function ProfileCard(props) {
  const [profile, setProfile] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [eventType, setEventType] = useState("");
  const [header, setHeader] = useState("");
  const [showDisables, setShowDisables] = useState(false);
  const [vaccinationTypes, setVaccinationTypes] = useState("");
  const [selectedVaccinationType, setSelectedVaccinationType] = useState("");

  const [patientMedicalRecords, setPatientMedicalRecords] = useState("");

  const [patientRecipes, setPatientRecipes] = useState("");

  const [patientDiseases, setPatientDiseases] = useState("");

  const [patientZTPTypes, setPatientZTPTypes] = useState([]);

  const medicalRecordsTable = {
    tableName: "Zdravotné záznamy",
    route: "/pacient",
    cellData: patientMedicalRecords,
    titles: [
      { field: "DATUM", header: "Dátum" },
      { field: "TYP", header: "Typ záznamu" },
    ],
    allowFilters: false,
    dialog: true,
    tableScrollHeight: "500px",
    editor: false,
  };

  const recipesTable = {
    tableName: "Predpísané recepty",
    route: "/pacient",
    cellData: patientRecipes,

    titles: [
      { field: "NAZOV", header: "Názov" },
      { field: "LEKAR", header: "Lekár" },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: "500px",
    editor: true,
  };

  const onEditDisableDate = (date) => {
    console.log(date);
  };

  const onEditDiseaseDate = (data) => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({ datum_od: data.DAT_OD, datum_do: data.DAT_DO }),
    };
    console.log(requestOptions);
    fetch("/update/choroba", requestOptions);
  };

  const diseasesTable = {
    tableName: "Choroby",
    route: "/pacient",
    cellData: patientDiseases,
    setCellData: setPatientDiseases,
    onEditDate: onEditDiseaseDate,
    titles: [
      { field: "NAZOV", header: "Názov choroby" },
      { field: "TYP", header: "Typ choroby" },
      { field: "DAT_OD", header: "Od" },
      { field: "DAT_DO", header: "Do" },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: "500px",
    editor: true,
  };

  const disablesTable = {
    tableName: "Postihnutia",
    route: "/pacient",
    cellData: patientZTPTypes,
    setCellData: setPatientZTPTypes,
    onEditDate: onEditDisableDate,
    titles: [
      { field: "NAZOV", header: "Postihnutie" },
      { field: "DAT_OD", header: "Od" },
      { field: "DAT_DO", header: "Do" },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: "500px",
    editor: true,
  };

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `patient/info/${
        typeof props.patientId !== "undefined" && props.patientId !== null
          ? props.patientId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setProfile(...data);
      });

    fetch(`selects/typyOckovania`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVaccinationTypes(data);
      });

    fetch(
      `patient/recepty/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientRecipes(data);
      });

    fetch(
      `patient/choroby/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientDiseases(data);
      });

    fetch(
      `patient/typyZTP/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientZTPTypes(data);
      });

    fetch(
      `patient/zdravZaznamy/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientMedicalRecords(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (eventType) => {
    setEventType(eventType);
    switch (eventType) {
      case "examination":
        setHeader("Vytvoriť nové vyšetrenie");
        break;
      case "operation":
        setHeader("Vytvoriť novú operáciu");
        break;
      case "hospit":
        setHeader("Vytvoriť novú hospitalizáciu");
        break;
      case "vacci":
        setHeader("Vytvoriť nové očkovanie");
        break;
      case "disease":
        setHeader("Pridať novú chorobu");
        break;
      case "ZTP":
        setHeader("Pridať nové ZŤP");
        break;
      default:
        break;
    }
    setShow(true);
  };

  const onHide = () => {
    setShow(false);
  };

  const onVaccinationTypeChange = (e) => {
    setSelectedVaccinationType(e.value);
  };

  const vacciDialog = () => {
    return (
      <div className="p-fluid grid formgrid">
        <div className="field col-12 ">
          <label htmlFor="basic">Dátum očkovania</label>
          <Calendar id="basic" showTime showIcon dateFormat="dd.mm.yy" />
        </div>
        <div className="field col-12 ">
          <Dropdown
            value={selectedVaccinationType}
            options={vaccinationTypes}
            onChange={onVaccinationTypeChange}
            optionLabel="NAZOV"
            placeholder="Vyber typ očkovania"
          />
        </div>
      </div>
    );
  };

  const renderDialog = () => {
    switch (eventType) {
      case "examination":
        return (
          <ExaminationForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
          />
        );
      case "operation":
        return (
          <OperationForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
          />
        );
      case "hospit":
        return (
          <HospitForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
          />
        );
      case "vacci":
        return vacciDialog();
      case "disease":
        return (
          <DiseaseForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
          />
        );
      case "ZTP":
        return (
          <DisablesForm
            patientId={
              props.patientId !== null ? props.patientId : location.state
            }
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
          />
        );
      default:
        break;
    }
  };

  return (
    <div>
      <div className="flex col-12 ">
        <Card
          className="col-5 shadow-4"
          style={{ width: "50rem", height: "40rem" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          <div className="flex ">
            <div className="col-5 text-center m-0">
              <h4>Rok narodenia</h4>
              <div>{profile.DATUM_NARODENIA}</div>
            </div>

            <div className="col-5 text-center m-0">
              <h4>Mobil</h4>
              <div>{profile.TEL}</div>
            </div>
          </div>

          <div className="flex w-100">
            <div className="col-5 text-center m-0">
              <h4>Vek</h4>
              <div>{profile.VEK}</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Email</h4>
              <div>{profile.MAIL}</div>
            </div>
          </div>

          <div className="flex">
            <div className="col-5 text-center m-0">
              <h4>Krvna skupina</h4>
              <div>{profile.TYP_KRVI}</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Poistovňa</h4>
              <div>{profile.NAZOV_POISTOVNE}</div>
            </div>
          </div>

          <div className="flex w-100">
            <div className="col-5 text-center m-0">
              <h4>Adresa</h4>
              <div>{profile.NAZOV_OBCE + " " + profile.PSC}</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>ZŤP</h4>
              <div>
                {patientZTPTypes.length !== 0 ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    Áno{" "}
                    <Button
                      label="Zoznam"
                      onClick={() => setShowDisables(true)}
                    ></Button>
                  </div>
                ) : (
                  "Nie"
                )}
              </div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Button label="Poslať správu" icon="pi pi-send" />
          </div>
        </Card>

        <Card
          className="col-4 shadow-4"
          title="Predpísané recepty"
          style={{ width: "50rem", height: "40rem" }}
        >
          <TableMedicalRecords {...recipesTable} />
        </Card>
      </div>

      <div className="col-12 flex">
        <Card
          className="col-5 shadow-4"
          title="Zdravotné záznamy"
          style={{ width: "50rem", height: "40rem" }}
        >
          <TableMedicalRecords {...medicalRecordsTable} />
        </Card>

        <Card
          className="col-5 shadow-4"
          title="Choroby"
          style={{ width: "50rem", height: "40rem" }}
        >
          <TableMedicalRecords {...diseasesTable} />
        </Card>
      </div>
      {props.userData.UserInfo.role === 3 ? (
        <>
          <div className="flex ">
            <div className="col-2 m-4">
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nové vyšetrenie"
                  icon="examination-icon"
                  onClick={() => handleClick("examination")}
                />
              </div>
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nová operácia"
                  icon="operation-icon"
                  onClick={() => handleClick("operation")}
                />
              </div>
            </div>

            <div className="col-2 m-4">
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nová hospitalizácia"
                  icon="hospit-icon"
                  onClick={() => handleClick("hospit")}
                />
              </div>
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nové očkovanie"
                  icon="vaccine-icon"
                  onClick={() => handleClick("vacci")}
                />
              </div>
            </div>

            <div className="col-2 m-4">
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nová choroba"
                  icon="disease-icon"
                  onClick={() => handleClick("disease")}
                />
              </div>
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nové ZŤP"
                  icon="disabled-icon"
                  onClick={() => handleClick("ZTP")}
                />
              </div>
            </div>

            <div className="col-2 m-4">
              <div className="p-3">
                <Button
                  style={{ width: "100%" }}
                  label="Nový recept"
                  icon="recipe-icon"
                  onClick={() => handleClick("recipe")}
                />
              </div>
            </div>
          </div>
          <Dialog
            visible={show}
            onHide={onHide}
            header={header}
            style={{ width: "80%" }}
          >
            {renderDialog()}
          </Dialog>
          <Dialog
            visible={showDisables}
            onHide={() => setShowDisables(false)}
            style={{ width: "1000px" }}
          >
            {" "}
            <TableMedicalRecords {...disablesTable} />
          </Dialog>
        </>
      ) : (
        ""
      )}
    </div>
  );
}
