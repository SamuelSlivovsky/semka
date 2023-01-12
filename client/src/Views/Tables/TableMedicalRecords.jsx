import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";

export default function TableMedic(props) {
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const { tableName, cellData, titles, allowFilters, tableScrollHeight } =
    props;
  const [popis, setPopis] = useState(null);

  const onHide = () => {
    setShowDialog(false);
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);

    fetch(`/zaznamy/popis/${value.ID_ZAZNAMU}`)
      .then((response) => response.json())
      .then((data) => {
        setPopis(data[0].POPIS);
      });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          {tableName}
          <span className="p-input-icon-left">
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue1}
              onChange={onGlobalFilterChange1}
              placeholder="Keyword Search"
            />
          </span>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters["global"].value = value;

    setFilters(_filters);
    setGlobalFilterValue1(value);
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
      DATUM: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue1("");
  };

  const header = allowFilters ? renderHeader() : "";
  return (
    <div>
      <div className="card">
        <DataTable
          value={cellData}
          responsiveLayout="scroll"
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          scrollHeight={tableScrollHeight}
          filterDisplay={allowFilters ? "menu" : ""}
          globalFilterFields={titles.field}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="ID_ZAZNAMU"></Column>
          {titles.map((title) => (
            <Column field={title.field} header={title.header} filter></Column>
          ))}
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
        onHide={() => onHide()}
      >
        <div>
          <h5>{selectedRow != null ? "Dátum: " + selectedRow.DATUM : ""} </h5>
          <div>{selectedRow != null ? popis : ""}</div>
        </div>
      </Dialog>
    </div>
  );
}
