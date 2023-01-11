import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";

export default function TableWithoutDetail(props) {
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters1, setFilters1] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const text =
    "What is Lorem Ipsum? Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s," +
    "when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into " +
    "electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages," +
    "and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

  const { tableName, cellData, titles } = props;

  const onHide = () => {
    setShowDialog(false);
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
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
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  useEffect(() => {
    initFilters1();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      category: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      quantity: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue1("");
  };

  const header = renderHeader();
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
          filters={filters1}
          filterDisplay="menu"
          globalFilterFields={titles.field}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          {titles.map((title) => (
            <Column
              field={title.field}
              header={title.header}
              sortable
              filter
            ></Column>
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
          <h4>Doktor:</h4>
          <h5>
            {selectedRow.DATUM != null ? "Dátum: " || selectedRow.DATUM : ""}{" "}
          </h5>
          <div>{text}</div>
        </div>
      </Dialog>
    </div>
  );
}
