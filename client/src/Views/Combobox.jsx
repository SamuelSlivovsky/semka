import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
import { Calendar } from "primereact/calendar";
import { Dialog } from "primereact/dialog";
export default function Combobox() {
  const [select, setSelect] = useState(null);
  const [valuesInTable, setValuesInTable] = useState([]);
  const [columns, setColumns] = useState([]);
  const [inputVal1, setInputVal1] = useState("");
  const [inputVal2, setInputVal2] = useState("");
  const [date, setDate] = useState(null);
  const [isDates, setIsDates] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [input1, setInput1] = useState(null);
  const [input2, setInput2] = useState(null);
  const [imgUrl, setImgUrl] = useState("");
  const [showDialog, setShowDialog] = useState(false);

  const selects = [
    {
      name: "Pacienti s najviac chorobami",
      path: "selects/najviacChoriPocet",
      attribute1: "count",
      fotka: false,
    },
    {
      name: "Pacienti s najviac operáciami",
      path: "selects/najviacOperovanyPercenta",
      attribute1: "percent",
      fotka: false,
    },
    {
      name: "Pacienti s najviac hospitalizáciami",
      path: "selects/najviacHospitalizovaniPercenta",
      attribute1: "percent",
      fotka: false,
    },
    {
      name: "Najlepšie platený zamestnanci",
      path: "selects/topZamestnanciVyplaty",
      attribute1: "count",
      fotka: true,
    },
    {
      name: "Typy očkovaní pacientov",
      path: "selects/typyOckovaniaPacienti",
      attribute1: "",
    },
    {
      name: "Zamestnanci oddeleni",
      path: "selects/zamestnanciOddeleni",
      fotka: false,
    },
    {
      name: "Najčastejšie choroby roka",
      path: "selects/najcastejsieChorobyRokaPocet",
      attribute1: "count",
      attribute2: "year",
      fotka: false,
    },
    {
      name: "Neobsadené lôžka",
      path: "selects/neobsadeneLozkaOddeleniaTyzden",
      attribute1: "id",
      fotka: false,
    },
    {
      name: "Zamestnanci oddelenia",
      path: "selects/zamestnanciOddelenia",
      attribute1: "id",
      fotka: true,
    },
  ];

  const onSelectChange = (e) => {
    setSelect(e.value);
    setIsDates(false);
    setInput1(null);
    setInput2(null);
    setInputVal1("");
    setInputVal2("");
    if (
      typeof e.value.attribute1 !== "undefined" &&
      e.value.attribute1 != null
    ) {
      renderInput(e.value.attribute1, 1);
    }
    if (
      typeof e.value.attribute2 !== "undefined" &&
      e.value.attribute2 != null
    ) {
      renderInput(e.value.attribute2, 2);
    }
  };

  const renderInput = (attr, level) => {
    let input = "";
    switch (attr) {
      case "count":
        input = (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              Zadajte pocet
            </label>
            <InputNumber
              inputId="withoutgrouping"
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode="decimal"
              useGrouping={false}
            />
          </div>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case "id":
        input = (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              Zadajte id
            </label>
            <InputNumber
              inputId="withoutgrouping"
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode="decimal"
              useGrouping={false}
            />
          </div>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case "date":
        input = (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              Zadajte rozsah datumov{" "}
            </label>
            <Calendar
              id="range"
              value={level === 1 ? inputVal1 : inputVal2}
              onChange={(e) =>
                level === 1
                  ? setInputVal1(e.value.toLocaleString("fr-CH"))
                  : setInputVal2(e.value.toLocaleString("fr-CH"))
              }
              readOnlyInput
            />
          </div>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case "percent":
        input = (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              Zadajte percento
            </label>
            <InputNumber
              inputId="withoutgrouping"
              value={level === 1 ? inputVal1 : inputVal2}
              onValueChange={(e) =>
                level === 1 ? setInputVal1(e.value) : setInputVal2(e.value)
              }
              mode="decimal"
              suffix="%"
              useGrouping={false}
            />
          </div>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case "year":
        input = (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              Zadajte rok
            </label>
            <Calendar
              id="range"
              value={level === 1 ? inputVal1 : inputVal2}
              onChange={(e) =>
                level === 1
                  ? setInputVal1(e.value.getFullYear())
                  : setInputVal2(e.value.getFullYear())
              }
              view="year"
              dateFormat="yy"
              readOnlyInput
            />
          </div>
        );
        level === 1 ? setInput1(input) : setInput2(input);
        break;
      case "dates":
        setIsDates(true);
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    console.log(inputVal1);
    fetch(`/${select.path}/${inputVal1}/${inputVal2}`)
      .then((res) => res.json())
      .then((result) => {
        setValuesInTable(result);
        loadColumnsHeaders(result);
      });
  };

  const loadColumnsHeaders = (data) => {
    if (Object.keys(...data).length > 0) {
      loadColumns(Object.keys(...data));
    }
  };

  const handleClick = (rowData) => {
    //console.log(rowData);
    window.open(
      "http://localhost:5000/selects/operacieNemocnice/1",
      "_blank",
      "noopener,noreferrer"
    );
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.key !== "empty") {
      return (
        <React.Fragment>
          <Button
            label="XML"
            style={{ marginRight: "10px" }}
            onClick={() => handleClick(rowData)}
          />
          <Button label="JSON" onClick={() => handleClick(rowData)} />
        </React.Fragment>
      );
    }
  };

  const loadColumns = (keys) => {
    let array = "";
    keys.forEach((element) => {
      array = [
        ...array,
        <Column
          field={element}
          header={element}
          key={element}
          rowSpan={10}
        ></Column>,
      ];
    });
    /*array = [
      ...array,
      <Column key="button" body={actionBodyTemplate}></Column>,
    ];*/
    setColumns(array);
  };

  const handleDatesChange = (dates) => {
    setDate(dates);
    if (dates[0] != null && dates[1] != null) {
      setInputVal1(dates[0].toLocaleDateString("fr-CH"));
      setInputVal2(dates[1].toLocaleDateString("fr-CH"));
    } else if (dates[0] == null && dates[1] == null) {
      setInputVal1("0");
      setInputVal2("0");
    }
  };

  const handleSelectedRow = (employee) => {
    setSelectedRow(employee);
    setShowDialog(true);
    fetch(`selects/zamestnanciFotka/${employee.Id}`)
      .then((res) => res.blob())
      .then((result) => {
        setImgUrl(URL.createObjectURL(result));
      });
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
    setImgUrl("");
  };

  return (
    <div className="card" style={{ marginTop: 10 }}>
      <div className="grid">
        <div className="field col-4 md:col-3" style={{ maxWidth: "400px" }}>
          <Dropdown
            value={select}
            options={selects}
            onChange={onSelectChange}
            optionLabel="name"
            placeholder="Vyber select"
          />
        </div>
        {input1}
        {input2}
        {isDates ? (
          <div className="field col-4 md:col-3">
            <label htmlFor="withoutgrouping">Zadajte rozsah datumov</label>
            <Calendar
              id="range"
              value={date}
              onChange={(e) => handleDatesChange(e.value)}
              selectionMode="range"
              readOnlyInput
            />
          </div>
        ) : (
          ""
        )}
        <div className="field col-4 md:col-3">
          <Button
            icon="pi pi-check"
            label="Zadaj"
            onClick={handleSubmit}
          ></Button>
        </div>
      </div>
      <div className="card">
        <DataTable
          value={valuesInTable}
          selectionMode={
            select !== null
              ? typeof select.fotka !== "undefined" && select.fotka != null
                ? "single"
                : ""
              : ""
          }
          selection={
            select !== null
              ? typeof select.fotka !== "undefined" && select.fotka != null
                ? selectedRow
                : ""
              : ""
          }
          onSelectionChange={(e) =>
            select !== null
              ? typeof select.fotka !== "undefined" && select.fotka != null
                ? handleSelectedRow(e.value)
                : ""
              : ""
          }
          scrollable
          showGridlines
          scrollHeight="80vh"
          responsiveLayout="scroll"
        >
          {columns}
        </DataTable>
      </div>
      <Dialog
        visible={showDialog}
        style={{ width: "50vw" }}
        onHide={() => onHide()}
      >
        <h1>{selectedRow != null ? selectedRow.Zamestnanec : ""}</h1>
        <img src={imgUrl} alt="" style={{ maxWidth: 400, maxHeight: 400 }} />
      </Dialog>
    </div>
  );
}
