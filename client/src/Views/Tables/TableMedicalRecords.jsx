import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { ProgressSpinner } from "primereact/progressspinner";
import { Calendar } from "primereact/calendar";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { Pdf } from "../../Forms/Pdf";
import GetUserData from "../../Auth/GetUserData";

export default function TableMedic(props) {
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const userData = GetUserData(localStorage.getItem("hospit-user"));
  const {
    tableName,
    cellData,
    titles,
    allowFilters,
    dialog,
    tableScrollHeight,
    editor,
    eventType,
  } = props;
  const [popis, setPopis] = useState(null);
  const [nazov, setNazov] = useState(null);

  const onHide = () => {
    setImgUrl(null);
    setShowDialog(false);
    setPopis(null);
    setNazov(null);
    setSelectedRow(null);
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setLoading(true);
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    setSelectedRow(value);
    fetch(`/zaznamy/priloha/${value.id}`, { headers })
      .then((res) => res.blob())
      .then((result) => {
        setImgUrl(URL.createObjectURL(result));
      });
    fetch(`/zaznamy/popis/${value.id}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setPopis(data[0].POPIS);
        setNazov(data[0].NAZOV);
        setLoading(false);
      });
  };

  const getRecordDetails = () => {
    let popis;
    console.log(cellData);
    cellData.map((data) => {
      if (data.id === selectedRow.id) {
        data.LEKAR === data.ODDELENIE
          ? (popis = <h5>{data.LEKAR} </h5>)
          : (popis = (
              <div>
                <h5>{data.LEKAR}</h5>
                <h5>{data.ODDELENIE}</h5>
              </div>
            ));
      }
      return "";
    });
    return popis;
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

  const onRowEditComplete = (e) => {
    let _products = [...cellData];
    let { newData, index } = e;

    _products[index] = newData;

    props.setCellData(_products);
    props.onEditDate(newData);
  };

  const dateEditor = (options) => {
    return (
      <Calendar
        value={options.value !== null ? formatDate(options.value) : null}
        onChange={(e) =>
          options.editorCallback(
            e.target.value.toLocaleDateString("de", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            })
          )
        }
        dateFormat="dd.mm.yy"
      />
    );
  };

  const formatDate = (dateString) => {
    var dateArray = dateString.split(".");
    var formattedDateString =
      dateArray[2] + "-" + dateArray[1] + "-" + dateArray[0];
    return new Date(formattedDateString);
  };

  const getDoctor = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    console.log("first");
    fetch(`/lekar/info/${props.doctorId}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
      });
  };

  const header = allowFilters ? renderHeader() : "";
  return (
    <div>
      <div className="card">
        <DataTable
          editMode={editor ? "row" : ""}
          value={cellData}
          scrollable
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => (dialog ? handleClick(e.value) : "")}
          header={header}
          filters={filters}
          scrollHeight={tableScrollHeight}
          filterDisplay={allowFilters ? "menu" : ""}
          globalFilterFields={titles.field}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          onRowEditComplete={onRowEditComplete}
        >
          <Column field="id"></Column>
          {titles.map((title) => (
            <Column
              field={title.field}
              header={title.header}
              filter
              editor={
                title.field === "DAT_DO" ? (options) => dateEditor(options) : ""
              }
            ></Column>
          ))}
          {editor ? (
            <Column
              rowEditor
              headerStyle={{ width: "10%", minWidth: "8rem" }}
              bodyStyle={{ textAlign: "center" }}
            ></Column>
          ) : (
            ""
          )}
        </DataTable>
      </div>

      <Dialog
        header={
          selectedRow != null
            ? selectedRow.MENO != null
              ? selectedRow.MENO + " " + selectedRow.PRIEZVISKO
              : selectedRow.type
            : ""
        }
        visible={showDialog && dialog}
        style={{ width: "50vw" }}
        onHide={() => onHide()}
      >
        {loading ? (
          <div style={{ width: "100%", display: "flex" }}>
            <ProgressSpinner />
          </div>
        ) : selectedRow !== null ? (
          <div style={{ maxWidth: "100%", overflowWrap: "break-word" }}>
            <PDFDownloadLink
              document={
                <Pdf
                  eventType={eventType}
                  data={selectedRow}
                  doctor={userData}
                />
              }
              fileName={`${selectedRow.PRIEZVISKO}${selectedRow.type}.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? "Loading document..." : "Download now!"
              }
            </PDFDownloadLink>
            <img
              src={imgUrl}
              alt=""
              style={{ maxWidth: 400, maxHeight: 400 }}
            />

            {selectedRow.type != null ? getRecordDetails() : ""}
            <h2>{nazov} </h2>
            <h5>{"Dátum: " + selectedRow.DATUM} </h5>
            <div>{popis}</div>
          </div>
        ) : (
          ""
        )}
      </Dialog>
    </div>
  );
}
