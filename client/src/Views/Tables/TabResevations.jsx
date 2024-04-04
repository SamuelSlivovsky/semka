import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { TabView, TabPanel } from "primereact/tabview";

export default function TabResevations() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [aktualneRezervacie, setAktualneRezervacie] = useState([]);
  const [prevzateRezervacie, setPrevzateRezervacie] = useState([]);
  const [dialogContext, setDialogContext] = useState(""); // 'aktualne' alebo 'vydane'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };

        const [aktualneResponse, prevzateResponse] = await Promise.all([
          fetch(
            `/pharmacyManagers/getZoznamAktualnychRezervacii/${userDataHelper.UserInfo.userid}`,
            { headers }
          ),
          fetch(
            `/pharmacyManagers/getZoznamPrevzatychRezervacii/${userDataHelper.UserInfo.userid}`,
            { headers }
          ),
        ]);

        if (!aktualneResponse.ok || !prevzateResponse.ok) {
          // Handle error (show toast or redirect)
          return;
        }

        const aktualneData = await aktualneResponse.json();
        const prevzateData = await prevzateResponse.json();

        setAktualneRezervacie(aktualneData);
        console.log(aktualneData);
        setPrevzateRezervacie(prevzateData);
        console.log(prevzateData);
      } catch (error) {
        // Handle error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const handleClickAktualne = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
    setDialogContext("aktualne"); // Nastaviť kontext pre aktuálne recepty
  };

  const handleClickPrevzate = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
    setDialogContext("prevzate"); // Nastaviť kontext pre vydané recepty
  };

  const renderDialogFooter = () => {
    if (dialogContext === "aktualne") {
      return (
        <div>
          <Button
            label="Zavrieť"
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => onHide()}
          />
          <Button
            label="Vydať rezervovaný liek"
            icon="pi pi-check"
            onClick={() => setShowEditDialog(true)}
            autoFocus
          />
        </div>
      );
    } else if (dialogContext === "prevzate") {
      return (
        <div>
          <Button
            label="Zavrieť"
            icon="pi pi-times"
            className="p-button-danger"
            onClick={() => onHide()}
          />
        </div>
      );
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať"
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
              Rezervácie liekov vo vašej lekárni
            </h2>
          </div>
        </div>
      </div>
    );
  };

  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-minus-circle"
          className="p-button-rounded p-button-raised"
          style={{
            backgroundColor: "#18dec8",
            color: "white",
          }}
          onClick={() => requestDeleteReservation(rowData)}
        />
      </React.Fragment>
    );
  };

  const deleteReservation = (rowData) => {
    console.log(rowData.ID_REZERVACIE);
    const token = localStorage.getItem("hospit-user");
    fetch(`/pharmacyManagers/deleteRezervaciaLieku/${rowData.ID_REZERVACIE}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Rezervácia zrušená",
            detail: "Rezervácia bola úspešne zrušená.",
            life: 3000,
          });
          setAktualneRezervacie(
            { authorization: "Bearer " + token },
            GetUserData(token)
          );
        } else {
          throw new Error("Problém pri zrušení rezervácie");
        }
      })
      .catch((error) => {
        console.error("Chyba:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri zrušení",
          detail: "Nepodarilo sa zrušiť rezerváciu.",
          life: 3000,
        });
      });

    // Zavrie potvrdzovací dialóg
    setShowConfirmDialog(false);
  };

  const requestDeleteReservation = (rowData) => {
    setSelectedRow(rowData); // Uložíme si vybranu rezervaciu do stavu
    setShowConfirmDialog(true); // Zobrazíme potvrdzovací dialog
  };

  const renderConfirmDialog = () => {
    return (
      <Dialog
        header="Zrušenie rezervácie v lekárni"
        visible={showConfirmDialog}
        style={{ width: "950px", textAlign: "center" }}
        modal
        footer={confirmDialogFooter}
        onHide={() => setShowConfirmDialog(false)}
      >
        <div
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
            <b>Naozaj chcete zrušiť rezerváciu lieku v tejto lekárni?</b>
            <br />
            <br />
            <br />
            {selectedRow?.ROD_CISLO}
            {": "}
            {selectedRow?.MENO} {selectedRow?.PRIEZVISKO}
            <br />
            <br />
            <b>Rezervovaný liek:</b> {selectedRow?.NAZOV_LIEKU}
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
        onClick={() => deleteReservation(selectedRow)}
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
      ID_REZERVACIE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      DATUM_REZERVACIE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      DATUM_PREVZATIA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <TabView>
      <TabPanel header="Aktuálne rezervácie liekov">
        <div>
          {renderConfirmDialog()}
          <Toast ref={toast} position="top-center" />
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
                value={aktualneRezervacie}
                responsiveLayout="scroll"
                selectionMode="single"
                paginator
                rows={15}
                selection={selectedRow}
                onSelectionChange={(e) => handleClickAktualne(e.value)}
                header={header}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                  "ID_REZERVACIE",
                  "DATUM_REZERVACIE",
                  "ROD_CISLO",
                  "MENO",
                  "PRIEZVISKO",
                ]}
                emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
              >
                <Column
                  field="ID_REZERVACIE"
                  header={"ID rezervácie"}
                  filter
                ></Column>
                <Column
                  field="DATUM_REZERVACIE"
                  header={"Dátum rezervácie"}
                  filter
                ></Column>
                <Column
                  field="ROD_CISLO"
                  header={"Rodné číslo"}
                  filter
                ></Column>
                <Column field="MENO" header={"Meno"} filter></Column>
                <Column
                  field="PRIEZVISKO"
                  header={"Priezvisko"}
                  filter
                ></Column>
                <Column body={actionBodyTemplate} header=""></Column>
              </DataTable>
            )}
          </div>
          <Dialog
            header="Detail rezervácie"
            visible={showDialog}
            style={{ textAlign: "center", width: "950px" }}
            modal
            footer={renderDialogFooter()}
            onHide={() => onHide()}
          >
            <div className="confirmation-content" style={{ display: "grid" }}>
              <i
                className="pi pi-info-circle"
                style={{
                  fontSize: "2rem",
                  color: "var(--blue-500)",
                  marginBottom: "1rem",
                }}
              ></i>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Názov rezervovaného lieku:</b> {selectedRow?.NAZOV_LIEKU}
              </span>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Rezervované množstvo lieku:</b>{" "}
                {selectedRow?.REZERVOVANY_POCET}
              </span>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Dostupné množstvo lieku na sklade:</b>{" "}
                {selectedRow?.DOSTUPNY_POCET}
              </span>
            </div>
          </Dialog>
          {/* Edit Date Dialog */}
          <Dialog
            visible={showEditDialog}
            onHide={() => setShowEditDialog(false)}
            header="Nastaviť dátum prevzatia"
            footer={
              <div>
                <Button
                  label="Zrušiť"
                  icon="pi pi-times"
                  onClick={() => setShowEditDialog(false)}
                  className="p-button-text"
                />
                <Button
                  label="Potvrdiť"
                  icon="pi pi-check"
                  // onClick={() => handleEditDate()}
                />
              </div>
            }
          >
            <Calendar
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.value)}
              showIcon
              dateFormat="yy-mm-dd"
            />
          </Dialog>
        </div>
      </TabPanel>
      <TabPanel header="Prevzaté rezervácie liekov">
        <div>
          {renderConfirmDialog()}
          <Toast ref={toast} position="top-center" />
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
                value={prevzateRezervacie}
                responsiveLayout="scroll"
                selectionMode="single"
                paginator
                rows={15}
                selection={selectedRow}
                onSelectionChange={(e) => handleClickPrevzate(e.value)}
                header={header}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                  "ID_REZERVACIE",
                  "DATUM_REZERVACIE",
                  "DATUM_PREVZATIA",
                  "ROD_CISLO",
                  "MENO",
                  "PRIEZVISKO",
                ]}
                emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
              >
                <Column
                  field="ID_REZERVACIE"
                  header={"ID rezervácie"}
                  filter
                ></Column>
                <Column
                  field="DATUM_REZERVACIE"
                  header={"Dátum rezervácie"}
                  filter
                ></Column>
                <Column
                  field="DATUM_PREVZATIA"
                  header={"Dátum prevzatia"}
                  filter
                ></Column>
                <Column
                  field="ROD_CISLO"
                  header={"Rodné číslo"}
                  filter
                ></Column>
                <Column field="MENO" header={"Meno"} filter></Column>
                <Column
                  field="PRIEZVISKO"
                  header={"Priezvisko"}
                  filter
                ></Column>
              </DataTable>
            )}
          </div>
          <Dialog
            header="Detail rezervácie"
            visible={showDialog}
            style={{ textAlign: "center", width: "950px" }}
            modal
            footer={renderDialogFooter()}
            onHide={() => onHide()}
          >
            <div className="confirmation-content" style={{ display: "grid" }}>
              <i
                className="pi pi-info-circle"
                style={{
                  fontSize: "2rem",
                  color: "var(--blue-500)",
                  marginBottom: "1rem",
                }}
              ></i>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Názov rezervovaného lieku:</b> {selectedRow?.NAZOV_LIEKU}
              </span>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Rezervované množstvo lieku:</b>{" "}
                {selectedRow?.REZERVOVANY_POCET}
              </span>
              <span style={{ marginBottom: "1rem", justifySelf: "start" }}>
                <b>Dátum prevzatia:</b> {selectedRow?.DATUM_PREVZATIA}
              </span>
            </div>
          </Dialog>
        </div>
      </TabPanel>
    </TabView>
  );
}
