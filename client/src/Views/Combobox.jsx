import React, { useState } from "react";
import { Dropdown } from "primereact/dropdown";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from "primereact/inputnumber";
export default function Combobox() {
  const [select, setSelect] = useState(null);
  const [valuesInTable, setValuesInTable] = useState([]);
  const [columns, setColumns] = useState([]);
  const [attribute1, setAttribute1] = useState();
  const [attribute2, setAttribute2] = useState();
  const [inputVal1, setInputVal1] = useState("");
  const [inputVal2, setInputVal2] = useState("");
  const [inputs, setInputs] = useState([]);
  const selects = [
    {
      name: "Pacienti s najviac chorobami",
      path: "selects/najviacChoriPocet",
      attribute1: "count",
    },
    {
      name: "Pacienti s najviac očkovaniami",
      path: "selects/najviacOckovaniPercenta",
      attribute1: "percent",
    },
    {
      name: "Pacienti s najviac hospitalizáciami",
      path: "selects/najviacHospitalizovaniPercenta",
      attribute1: "percent",
    },
    {
      name: "Najlepšie platený zamestnanci",
      path: "selects/topZamestnanciVyplaty",
      attribute1: "count",
    },
    { name: "Výplaty", path: "selects/sumaVyplatRoka", attribute1: "id" },
    {
      name: "Typy očkovaní pacientov",
      path: "selects/typyOckovaniaPacienti",
      attribute1: "",
    },
    {
      name: "Zamestanci oddelenia",
      path: "selects/zamestnanciOddeleni",
      attribute1: "",
    },
    {
      name: "Najčastejšie choroby roka",
      path: "selects/najcastejsieChorobyRokaPocet",
      attribute1: "count",
      attribute2: "year",
    },
    {
      name: "Neobsadené lôžka",
      path: "selects/neobsadeneLozkaOddeleniaTyzden",
      attribute1: "id",
    },
    {
      name: "Operácie",
      path: "selects/operacia/operacie",
      attribute1: "dates",
    },
  ];

  const onSelectChange = (e) => {
    setSelect(e.value);
    setInputs([]);
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
    console.log(attr);
    switch (attr) {
      case "count":
        input = (
          <div className="field col-12 md:col-3">
            <label htmlFor="withoutgrouping">Without Grouping</label>
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
        setInputs(input);
        break;
      case "id":
        break;
      case "date":
        break;
      case "percent":
        break;
      case "year":
        break;
      case "dates":
        break;
      default:
        break;
    }
  };

  const handleSubmit = () => {
    fetch(`http://localhost:5000/${select.path}/${inputVal1}/${inputVal2}`)
      .then((res) => res.json())
      .then((result) => {
        loadColumnsHeaders(result);
        setValuesInTable(result);
        console.log(valuesInTable);
      });
  };

  const loadColumnsHeaders = (data) => {
    if (Object.keys(...data).length > 0) {
      loadColumns(Object.keys(...data));
    }
  };

  const handleClick = (rowData) => {
    console.log(rowData);
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
        <Column field={element} header={element} key={element}></Column>,
      ];
    });
    array = [
      ...array,
      <Column key="button" body={actionBodyTemplate}></Column>,
    ];
    setColumns(array);
  };

  return (
    <div className="card">
      <Dropdown
        value={select}
        options={selects}
        onChange={onSelectChange}
        optionLabel="name"
        placeholder="Vyber select"
      />
      {inputs}
      <Button icon="pi pi-check" label="Zadaj" onClick={handleSubmit}></Button>
      <div className="card">
        <DataTable
          value={valuesInTable}
          scrollable
          scrollHeight="600px"
          responsiveLayout="scroll"
        >
          {columns}
        </DataTable>
      </div>
    </div>
  );
}
