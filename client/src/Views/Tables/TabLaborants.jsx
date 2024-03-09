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

export default function TabLaborants() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [laboranti, setLaboranti] = useState([]);
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/pharmacyManagers/laboranti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
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
        setLaboranti(data);
        console.log(data);
        if (data.length > 0) {
          setNazovLekarne(data[0].LEKAREN_NAZOV);
          console.log(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const onSubmit = () => {
    setShowDialog(false);
    navigate("/laborant", { state: selectedRow.CISLO_ZAM });
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
            <h2>Zoznam laborantov pracujúcich v lekárni: </h2>
            <h3>{nazovLekarne}</h3>
          </div>
        </div>
      </div>
    );
  };

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
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      CISLO_ZAM: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
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
          <DataTable
            value={laboranti}
            responsiveLayout="scroll"
            selectionMode="single"
            paginator
            rows={15}
            selection={selectedRow}
            onSelectionChange={(e) => handleClick(e.value)}
            header={header}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "ROD_CISLO",
              "MENO",
              "PRIEZVISKO",
              "CISLO_ZAM",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column field="ROD_CISLO" header={"Rodné číslo"} filter></Column>
            <Column field="MENO" header={"Meno"} filter></Column>
            <Column field="PRIEZVISKO" header={"Priezvisko"} filter></Column>
            <Column field="CISLO_ZAM" header={"ID zamestnanca"} filter></Column>
          </DataTable>
        )}
      </div>
      <Dialog
        header={
          selectedRow != null
            ? selectedRow.MENO + " " + selectedRow.PRIEZVISKO
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
