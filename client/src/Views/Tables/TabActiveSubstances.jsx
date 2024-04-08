import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";

export default function TabMedicaments() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newActiveSubstance, setNewActiveSubstance] = useState({});
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [zoznamUcinnychLatok, setZoznamUcinnychLatok] = useState([]);
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false); //sluzi na to, ze polia v addForm musia byt required

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetchGetZoznamUcinnychLatok(headers, userDataHelper);
  }, []);

  const fetchGetZoznamUcinnychLatok = (headers, userDataHelper) => {
    fetch(
      `/pharmacyManagers/getUcinnaLatka/${userDataHelper.UserInfo.userid}`,
      {
        headers,
      }
    )
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
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
        setZoznamUcinnychLatok(data);
        console.log(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchSubmitNewActiveSubstance = () => {
    const activeSubstanceData = {
      ...newActiveSubstance,
    };
    console.log(activeSubstanceData);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };
    fetch("/pharmacyManagers/insertUcinneLatky", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(activeSubstanceData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        toast.current.show({
          severity: "success",
          summary: "Účinná látka pridaná",
          detail: "Účinná látka boa úspešne pridaná do zoznamu.",
          life: 3000,
        });
        setShowAddDialog(false); // Zavrie dialogové okno po úspešnom pridaní
        setNewActiveSubstance({}); // Resetuje stav formulára
        fetchGetZoznamUcinnychLatok(headers, GetUserData(token)); // Znovu načíta zoznam lekárnikov po pridaní nového
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri pridávaní",
          detail: "Nepodarilo sa pridať novú účinnú látku.",
          life: 3000,
        });
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ color: "#00796b" }} />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať"
              style={{ borderRadius: "20px", borderColor: "#00796b" }}
            />
          </span>
          <div className="ml-4">
            <h2
              style={{
                color: "#00796b",
                borderBottom: "2px solid #004d40",
                paddingBottom: "5px",
                marginBottom: "10px",
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Zoznam učinných látok
            </h2>
          </div>
        </div>
        <Button
          style={{ height: "50px", top: "10px", right: "10px" }}
          label="Pridať účinnú látku"
          icon="pi pi-plus"
          onClick={() => setShowAddDialog(true)}
        />
      </div>
    );
  };

  const handleSubmit = () => {
    setSubmitted(true); // Nastavíme, že bol formulár pokusom odoslaný
    if (newActiveSubstance.nazov) {
      // Ak sú všetky polia vyplnené, pokračujeme v odoslaní
      fetchSubmitNewActiveSubstance();
    }
  };

  const renderErrorMessage = (fieldName) => {
    return (
      submitted &&
      !newActiveSubstance[fieldName] && (
        <small className="p-error">Toto pole je povinné!</small>
      )
    );
  };

  // Form dialog for adding a new pharmacist
  const renderAddActiveSubstanceDialog = () => {
    return (
      <Dialog
        visible={showAddDialog}
        style={{ width: "450px" }}
        header="Nová účinná látka"
        modal
        className="p-fluid"
        onHide={() => setShowAddDialog(false)}
      >
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="nazov">Názov účinnej látky</label>
          <InputText
            id="nazov"
            value={newActiveSubstance.nazov}
            onChange={(e) =>
              setNewActiveSubstance({
                ...newActiveSubstance,
                nazov: e.target.value,
              })
            }
            placeholder="Zadajte názov účinnej látky"
            required
          />
          {renderErrorMessage("nazov")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="latinskyNazov">Latinský názov</label>
          <InputText
            id="latinskyNazov"
            value={newActiveSubstance.latinsky_nazov}
            onChange={(e) =>
              setNewActiveSubstance({
                ...newActiveSubstance,
                latinsky_nazov: e.target.value,
              })
            }
            placeholder="Zadajte latinský názov"
          />
        </div>
        <Button
          style={{ marginTop: "50px" }}
          label="Pridať"
          icon="pi pi-check"
          onClick={() => {
            handleSubmit();
          }}
        />
      </Dialog>
    );
  };

  // Function to render Edit and Delete buttons
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-outlined p-button-raised p-button-warning mr-2"
          onClick={() => editActiveSubstance(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-outlined p-button-raised p-button-danger"
          onClick={() => requestDeleteActiveSubstance(rowData)}
        />
      </React.Fragment>
    );
  };

  //@TODO Add these functions to handle edit and delete actions
  const editActiveSubstance = () => {
    // Implementation for editing Active Substances
  };

  const deleteUcinnaLatka = (rowData) => {
    console.log(rowData.ID_UCINNA_LATKA);
    const token = localStorage.getItem("hospit-user");
    fetch(`/pharmacyManagers/deleteUcinnaLatka/${rowData.ID_UCINNA_LATKA}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Účinná látka vymazaná",
            detail: "Účinná látka bola úspešne vymazaná.",
            life: 3000,
          });
          fetchGetZoznamUcinnychLatok(
            { authorization: "Bearer " + token },
            GetUserData(token)
          );
        } else {
          throw new Error("Problém pri vymazávaní účinnej látky");
        }
      })
      .catch((error) => {
        console.error("Chyba:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri vymazávaní",
          detail: "Nepodarilo sa vymazať účinnú látku.",
          life: 3000,
        });
      });

    // Zavrie potvrdzovací dialóg
    setShowConfirmDialog(false);
  };

  const requestDeleteActiveSubstance = (rowData) => {
    setSelectedRow(rowData);
    setShowConfirmDialog(true);
  };

  const renderConfirmDialog = () => {
    return (
      <Dialog
        header="Potvrdenie vymazania"
        visible={showConfirmDialog}
        style={{ width: "450px", textAlign: "center" }}
        modal
        footer={confirmDialogFooter}
        onHide={() => setShowConfirmDialog(false)}
      >
        <div
          div
          className="confirmation-content"
          style={{ textAlign: "center", display: "grid" }}
        >
          <i
            className="pi pi-exclamation-triangle"
            style={{
              fontSize: "2rem",
              color: "var(--yellow-500)",
              marginBottom: "1rem",
            }}
          ></i>
          <span style={{ marginBottom: "1rem" }}>
            Naozaj chcete vymazať účinnú látku: {selectedRow?.NAZOV}?
          </span>
        </div>
      </Dialog>
    );
  };

  const confirmDialogFooter = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        label="Nie"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setShowConfirmDialog(false)}
      />
      <Button
        label="Áno"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => deleteUcinnaLatka(selectedRow)}
      />
    </div>
  );

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  useEffect(() => {
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ID_UCINNA_LATKA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      NAZOV: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      LATINSKY_NAZOV: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <div>
      {renderConfirmDialog()}
      <Toast ref={toast} position="top-center" />
      {renderAddActiveSubstanceDialog()}
      <div className="card">
        {loading ? (
          <div
            className="p-d-flex p-jc-center p-ai-center"
            style={{ height: "300px" }}
          >
            <ProgressSpinner
              className="p-d-flex p-jc-center p-ai-center"
              style={{
                height: "100vh",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: "rgba(255, 255, 255, 0.8)",
              }}
              strokeWidth="4"
            />
          </div>
        ) : (
          <DataTable
            value={zoznamUcinnychLatok}
            responsiveLayout="scroll"
            selectionMode="single"
            paginator
            rows={15}
            selection={selectedRow}
            // onSelectionChange={(e) => handleClick(e.value)}
            header={header}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={["ID_UCINNA_LATKA", "NAZOV", "LATINSKY_NAZOV"]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column
              field="ID_UCINNA_LATKA"
              header={"ID účinnej látky"}
              filter
            ></Column>
            <Column
              field="NAZOV"
              header={"Názov účinnej látky"}
              filter
            ></Column>
            <Column
              field="LATINSKY_NAZOV"
              header={"Latinský názov"}
              filter
            ></Column>
            <Column body={actionBodyTemplate} header=""></Column>
          </DataTable>
        )}
      </div>
    </div>
  );
}
