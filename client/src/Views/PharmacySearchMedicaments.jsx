import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import GetUserData from "../Auth/GetUserData";
import { Toast } from "primereact/toast";

export default function PharmacySearchMedicaments() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [searchLiekyLekarenskySklad, setSearchLiekyLekarenskySklad] = useState(
    []
  );
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(
      `/lekarenskySklad/lekarenskySkladVyhladavnieLieciva/${userDataHelper.UserInfo.userid}`,
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
        setSearchLiekyLekarenskySklad(data);
      });
  }, []);

  // const onHide = () => {
  //   setShowDialog(false);
  //   setSelectedRow(null);
  // };

  // const onSubmit = () => {
  //   setShowDialog(false);
  //   navigate("/pharmacist", { state: selectedRow.CISLO_ZAM });
  // };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  // const renderDialogFooter = () => {
  //   return (
  //     <div>
  //       <Button
  //         label="Zatvoriť"
  //         icon="pi pi-times"
  //         className="p-button-danger"
  //         onClick={() => onHide()}
  //       />
  //       <Button
  //         label="Detail"
  //         icon="pi pi-check"
  //         onClick={() => onSubmit()}
  //         autoFocus
  //       />
  //     </div>
  //   );
  // };

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
            <h2>Vyhľadávanie lekárne, ktorá má liečivo skladom</h2>
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
      NAZOV_LEKARNE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      NAZOV_LIEKU: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      DATUM_TRVANLIVOSTI: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      POCET: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <div className="card">
        <DataTable
          value={searchLiekyLekarenskySklad}
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
            "NAZOV_LEKARNE",
            "NAZOV_LIEKU",
            "DATUM_TRVANLIVOSTI",
            "POCET",
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column
            field="NAZOV_LEKARNE"
            header={"Názov lekárne"}
            filter
          ></Column>
          <Column field="NAZOV_LIEKU" header={"Názov lieku"} filter></Column>
          <Column
            field="DATUM_TRVANLIVOSTI"
            header={"Dátum expirácie"}
            filter
          ></Column>
          <Column field="POCET" header={"Ks na sklade"} filter></Column>
        </DataTable>
      </div>
      <Dialog
        header={
          selectedRow != null
            ? selectedRow.MENO + " " + selectedRow.PRIEZVISKO
            : ""
        }
        visible={showDialog}
        style={{ width: "50vw" }}
        // footer={renderDialogFooter()}
        // onHide={() => onHide()}
      ></Dialog>
    </div>
  );
}