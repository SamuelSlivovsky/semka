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
import { TabView, TabPanel } from "primereact/tabview";

export default function TabPrescriptions() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [aktualneRecepty, setAktualneRecepty] = useState([]);
  const [vydaneRecepty, setVydaneRecepty] = useState([]);
  const navigate = useNavigate();
  const [rodneCisloEntered, setRodneCisloEntered] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };

        const [aktualneResponse, vydaneResponse] = await Promise.all([
          fetch(
            `/pharmacyPrescriptions/zoznamAktualnychReceptov/${userDataHelper.UserInfo.userid}`,
            { headers }
          ),
          fetch(
            `/pharmacyPrescriptions/zoznamVydanychReceptov/${userDataHelper.UserInfo.userid}`,
            { headers }
          ),
        ]);

        if (!aktualneResponse.ok || !vydaneResponse.ok) {
          // Handle error (show toast or redirect)
          return;
        }

        const aktualneData = await aktualneResponse.json();
        const vydaneData = await vydaneResponse.json();

        setAktualneRecepty(aktualneData);
        console.log(aktualneData);
        setVydaneRecepty(vydaneData);
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

  const onSubmit = () => {
    setShowDialog(false);
    navigate("/prescription_detail", { state: selectedRow.ID_RECEPTU });
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="Zatvoriť"
          icon="pi pi-times"
          className="p-button-danger"
          onClick={() => onHide()}
        />
        <Button
          label="Detail"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    const trimmedValue = value.trim();

    if (trimmedValue.length >= 6) {
      let _filters = { ...filters };
      _filters["global"].value = trimmedValue;

      setRodneCisloEntered(true);
      setFilters(_filters);
      setGlobalFilterValue(trimmedValue);
    } else {
      // Ak je zadaných menej ako šesť čísel, nezobrazujte dáta
      setRodneCisloEntered(false);
      setGlobalFilterValue(value);
    }
  };

  useEffect(() => {
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      ID_RECEPTU: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      MENO_PACIENTA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO_PACIENTA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  return (
    <div>
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
          <div>
            <TabView>
              <TabPanel header="Predpísané recepty">
                <div className="flex justify-content-between">
                  <div className="table-header ml-5">
                    <span className="p-input-icon-left">
                      <i className="pi pi-search" />
                      <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Vyhľadať"
                      />
                    </span>
                    <div className="ml-4">
                      <h2>Predpísané recepty</h2>
                    </div>
                  </div>
                </div>

                {rodneCisloEntered ? (
                  <DataTable
                    value={aktualneRecepty}
                    responsiveLayout="scroll"
                    selectionMode="single"
                    paginator
                    rows={15}
                    selection={selectedRow}
                    onSelectionChange={(e) => handleClick(e.value)}
                    filters={filters}
                    filterDisplay="menu"
                    globalFilterFields={[
                      "ID_RECEPTU",
                      "ROD_CISLO",
                      "MENO_PACIENTA",
                      "PRIEZVISKO_PACIENTA",
                    ]}
                    emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
                  >
                    <Column
                      field="ID_RECEPTU"
                      header={"Id receptu"}
                      filter
                    ></Column>
                    <Column
                      field="ROD_CISLO"
                      header={"Rodné číslo pacienta"}
                      filter
                    ></Column>
                    <Column
                      field="MENO_PACIENTA"
                      header={"Meno pacienta"}
                      filter
                    ></Column>
                    <Column
                      field="PRIEZVISKO_PACIENTA"
                      header={"Priezvisko pacienta"}
                      filter
                    ></Column>
                  </DataTable>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      marginTop: "35vh",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <p>
                      Zadajte rodné číslo pacienta pre zobrazenie liekov na
                      predpis!
                    </p>
                  </div>
                )}
              </TabPanel>

              <TabPanel header="Vydané recepty">
                <div className="flex justify-content-between">
                  <div className="table-header ml-5">
                    <span className="p-input-icon-left">
                      <i className="pi pi-search" />
                      <InputText
                        value={globalFilterValue}
                        onChange={onGlobalFilterChange}
                        placeholder="Vyhľadať"
                      />
                    </span>
                    <div className="ml-4">
                      <h2>Vydané recepty</h2>
                    </div>
                  </div>
                </div>

                {rodneCisloEntered ? (
                  <DataTable
                    value={vydaneRecepty}
                    responsiveLayout="scroll"
                    selectionMode="single"
                    paginator
                    rows={15}
                    selection={selectedRow}
                    onSelectionChange={(e) => handleClick(e.value)}
                    filters={filters}
                    filterDisplay="menu"
                    globalFilterFields={[
                      "ID_RECEPTU",
                      "ROD_CISLO",
                      "MENO_PACIENTA",
                      "PRIEZVISKO_PACIENTA",
                    ]}
                    emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
                  >
                    <Column
                      field="ID_RECEPTU"
                      header={"Id receptu"}
                      filter
                    ></Column>
                    <Column
                      field="ROD_CISLO"
                      header={"Rodné číslo pacienta"}
                      filter
                    ></Column>
                    <Column
                      field="MENO_PACIENTA"
                      header={"Meno pacienta"}
                      filter
                    ></Column>
                    <Column
                      field="PRIEZVISKO_PACIENTA"
                      header={"Priezvisko pacienta"}
                      filter
                    ></Column>
                  </DataTable>
                ) : (
                  <div
                    style={{
                      textAlign: "center",
                      fontSize: "25px",
                      marginTop: "35vh",
                      transform: "translateY(-50%)",
                    }}
                  >
                    <p>
                      Zadajte rodné číslo pacienta pre zobrazenie vydaných
                      receptov!
                    </p>
                  </div>
                )}
              </TabPanel>
            </TabView>
          </div>
        )}
      </div>
      <Dialog
        header={
          selectedRow != null
            ? selectedRow.MENO_PACIENTA + " " + selectedRow.PRIEZVISKO_PACIENTA
            : ""
        }
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      ></Dialog>
    </div>
  );
}
