import React, { useState, useRef, useEffect } from "react";
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
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";
import { Tag } from "primereact/tag";

export default function TableMedic(props) {
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [leaveMessage, setLeaveMessage] = useState("");
  const [canAdd, setCanAdd] = useState(false);
  const [endDate, setEndDate] = useState(new Date());
  const userData = GetUserData(localStorage.getItem("hospit-user"));
  const {
    tableName,
    cellData,
    fetchData,
    titles,
    allowFilters,
    dialog,
    tableScrollHeight,
    editor,
    eventType,
    tableLoading,
    isPatient,
  } = props;
  const [popis, setPopis] = useState(null);
  const [nazov, setNazov] = useState(null);
  const toast = useRef(null);
  const navigate = useNavigate();

  const onHide = () => {
    setImgUrl(null);
    setShowDialog(false);
    setPopis(null);
    setNazov(null);
    setSelectedRow(null);
    setCanAdd(false);
    setLeaveMessage("");
    setEndDate(new Date());
    if (fetchData) fetchData();
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setLoading(true);
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    setSelectedRow(value);
    setLeaveMessage(
      value.PREPUSTACIA_SPRAVA != null
        ? value.PREPUSTACIA_SPRAVA.replace(/\\n/g, "\n")
        : ""
    );
    setEndDate(
      value.UNFORMATED_DAT_DO
        ? new Date(value.UNFORMATED_DAT_DO)
        : value.DAT_DO
        ? new Date(value.DAT_DO)
        : new Date()
    );
    fetch(`/zaznamy/priloha/${value.id_zaz}`, { headers })
      .then((res) => res.blob())
      .then((result) => {
        setImgUrl(URL.createObjectURL(result));
        setLoading(false);
      });
    fetch(`/zaznamy/popis/${value.id_zaz}`, { headers })
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (response.status === 410) {
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
        setPopis(data[0].POPIS);
        setNazov(data[0].NAZOV);
      });
  };

  const getRecordDetails = () => {
    let popis;
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

  const endHospitalization = async () => {
    setSelectedRow({
      ...selectedRow,
      DAT_DO: endDate,
      PREPUSTACIA_SPRAVA: leaveMessage,
    });
    setCanAdd(false);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + localStorage.getItem("hospit-user"),
      },
      body: JSON.stringify({
        dat_do: endDate.toLocaleString("en-GB").replace(",", ""),
        sprava: leaveMessage.replace(/\n/g, "\\n"),
        id_hosp: selectedRow.ID_HOSP,
      }),
    };
    await fetch("/hospitalizacia/ukoncit", requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "Úspešná zmena dátumu ukončenia",
            life: 6000,
          });
        }
      })
      .then(() => (props.onInsert ? props.onInsert() : ""))
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: error.message,
          life: 6000,
        });
      });
    if (leaveMessage != "" && leaveMessage != null) {
      const queryString = new URLSearchParams({
        name: selectedRow.MENO,
        surname: selectedRow.PRIEZVISKO,
        message: leaveMessage,
        birthId: selectedRow.ROD_CISLO,
        leaveDate: endDate.toLocaleString("en-GB").replace(",", ""),
      }).toString();

      window.open(`/add/leavePdf?${queryString}`, "_blank");
    }
  };

  const leaveBody = (rowData) => {
    return rowData.ID_HOSP != null ? (
      <Tag
        severity={
          rowData?.PREPUSTACIA_SPRAVA != "" &&
          rowData?.PREPUSTACIA_SPRAVA != null
            ? "success"
            : "danger"
        }
      >
        {rowData?.PREPUSTACIA_SPRAVA != "" &&
        rowData?.PREPUSTACIA_SPRAVA != null
          ? "Áno"
          : "Nie"}
      </Tag>
    ) : (
      ""
    );
  };

  const header = allowFilters ? renderHeader() : "";
  return (
    <div>
      <div className="card">
        <Toast ref={toast} position="top-center" />
        <DataTable
          editMode={editor ? "row" : ""}
          loading={tableLoading}
          value={cellData}
          scrollable
          selectionMode="single"
          paginator
          rows={15}
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
                editor && title.field === "DAT_DO"
                  ? (options) => dateEditor(options)
                  : ""
              }
            ></Column>
          ))}

          {eventType == "Hospitalizácia" || tableName == "Zdravotné záznamy" ? (
            <Column body={leaveBody} header="Prepúšťacia správa?"></Column>
          ) : (
            ""
          )}
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
        ) : selectedRow !== null && imgUrl ? (
          <div
            style={{
              maxWidth: "100%",
              overflowWrap: "break-word",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <PDFDownloadLink
              style={{
                height: "40px",
                width: "120px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "5px",
                textDecoration: "none",
                marginBottom: "10px",
                backgroundColor: "#14B8A6",
              }}
              document={
                <Pdf
                  eventType={eventType ? eventType : selectedRow.TYP}
                  data={selectedRow}
                  doctor={userData}
                  desc={popis}
                  name={nazov}
                  image={imgUrl}
                />
              }
              fileName={`${selectedRow.PRIEZVISKO}${
                selectedRow.type ? selectedRow.type : selectedRow.TYP
              }.pdf`}
            >
              {({ blob, url, loading, error }) =>
                loading ? (
                  "Načítavam"
                ) : (
                  <span
                    style={{
                      fontWeight: "bold",
                      color: "white",
                      display: "flex",
                      gap: "10px",
                    }}
                  >
                    {" "}
                    <i
                      className="pi pi-file-pdf"
                      style={{ fontSize: "20px" }}
                    ></i>
                    Stiahnuť
                  </span>
                )
              }
            </PDFDownloadLink>
            {selectedRow.type != null ? getRecordDetails() : ""}
            <h2>{nazov} </h2>
            <h5>{"Dátum: " + selectedRow.DATUM} </h5>
            <div>{popis}</div>
            <img src={imgUrl} alt="" width={"200"} height={"auto"} />
            {(selectedRow.type == "HOS" ||
              selectedRow.TYP == "Hospitalizácia") &&
            !isPatient ? (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  marginTop: "10px",
                }}
              >
                {canAdd ? (
                  ""
                ) : (
                  <Button
                    label={
                      selectedRow.DAT_DO == null
                        ? "Ukončiť hospitalizáciu?"
                        : "Zmeniť dátum ukončenia?"
                    }
                    icon="pi pi-plus"
                    onClick={() => setCanAdd(true)}
                  />
                )}
                {canAdd ? (
                  <div
                    style={{
                      width: "100%",
                      marginTop: "10px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "10px",
                    }}
                  >
                    <InputTextarea
                      style={{ width: "100%" }}
                      rows={5}
                      value={leaveMessage}
                      onChange={(e) => setLeaveMessage(e.target.value)}
                    />
                    <Calendar
                      showTime
                      value={endDate}
                      onChange={(e) => setEndDate(e.value)}
                    />
                    <Button
                      label="Pridaj"
                      onClick={() => endHospitalization()}
                    />
                  </div>
                ) : (
                  ""
                )}
              </div>
            ) : (
              ""
            )}
          </div>
        ) : (
          ""
        )}
      </Dialog>
    </div>
  );
}
