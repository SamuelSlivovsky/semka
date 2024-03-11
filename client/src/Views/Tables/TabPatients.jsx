import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import { Tag } from "primereact/tag";
import GetUserData from "../../Auth/GetUserData";

export default function TabPatients() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [pacienti, setPacienti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setPacienti(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (value) => {
    navigate("/patient", { state: value.ID_PACIENTA });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          Pacienti
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Keyword Search"
            />
          </span>
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
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      PSC: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        style={{ width: "110px" }}
        severity={rowData.JE_HOSPIT ? "success" : "info"}
        value={rowData.JE_HOSPIT == 1 ? "Hospitalizovaný" : "Iné"}
      />
    );
  };

  const header = renderHeader();
  return (
    <div>
      <div className="card">
        <DataTable
          value={pacienti}
          responsiveLayout="scroll"
          selectionMode="single"
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["ROD_CISLO", "MENO", "PRIEZVISKO", "PSC"]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="ROD_CISLO" header={"Rodné číslo"} filter></Column>
          <Column field="MENO" header={"Meno"} filter></Column>
          <Column field="PRIEZVISKO" header={"Priezvisko"} filter></Column>
          <Column field="PSC" header={"PSČ"} filter></Column>
          <Column
            body={statusBodyTemplate}
            header={"Status"}
            field="JE_HOSPIT"
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
