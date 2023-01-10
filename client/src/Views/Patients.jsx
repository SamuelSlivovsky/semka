import React from "react";
/*import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
//import mockDataJson from "../mock/mock-data.json";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";*/
import TabPatients from "./Tables/TabPatients";
import "../styles/patients.css";

function Patient() {
  //const [mockData, setMockData] = useState([]);
  /*const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);*/

  /*const navigate = useNavigate();

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  useEffect(() => {
    fetch("http://localhost:5000/lekar/pacienti")
      .then((response) => response.json())
      .then((data) => {
        setPatients(data);
        console.log(data);
      });
    setLoading(false);
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const onSubmit = () => {
    setShowDialog(false);
    navigate("/patient");
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  const getVek = () => {
    if (selectedRow != null) {
      let birthDate =
        "19" +
        selectedRow.ROD_CISLO.substring(0, 2) +
        "-" +
        (selectedRow.ROD_CISLO.substring(2, 4) % 50) +
        "-" +
        selectedRow.ROD_CISLO.substring(4, 6);

      birthDate = new Date(birthDate);

      var today = new Date();
      return getDifferenceInDays(today, birthDate);
    }
  };

  const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return Math.round(diffInMs / (1000 * 60 * 60 * 24) / 365);
  };

  const getPohlavie = () => {
    if (selectedRow !== null)
      return selectedRow.ROD_CISLO.substring(2, 3) === "5" ||
        selectedRow.ROD_CISLO.substring(2, 3) === "6"
        ? "Žena"
        : "Muž";
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
          label="Otvoriť kartu pacienta"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const renderSearchHeader = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue}
            onChange={onGlobalFilterChange}
            placeholder="Keyword Search"
          />
        </span>
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
    });
    setGlobalFilterValue("");
  };*/

  return (
    <div>
      {/* <div className="card" style={{ height: "100vh" }}>
        <DataTable
          value={patients}
          responsiveLayout="scroll"
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => handleClick(e.value)}
          header={renderSearchHeader()}
          filters={filters}
          scrollable
          scrollHeight="flex"
          filterDisplay="menu"
          loading={loading}
          globalFilterFields={["MENO", "PRIEZVISKO", "ROD_CISLO"]}
          emptyMessage="Nenašli sa žiadny pacienti"
        >
          <Column field="MENO" header="Meno" sortable filter></Column>
          <Column
            field="PRIEZVISKO"
            header="Priezvisko"
            sortable
            filter
          ></Column>
          <Column
            field="ROD_CISLO"
            header="Rodné číslo"
            sortable
            filter
          ></Column>
          <Column field="TEL" header="Tel."></Column>
          <Column field="MAIL" header="Email"></Column>
        </DataTable>
      </div>
      <Dialog
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <h1>
          {selectedRow != null
            ? selectedRow.MENO + " " + selectedRow.PRIEZVISKO
            : ""}
        </h1>
        <p>{getPohlavie()}</p>
        <p>{getVek() + " rokov"}</p>
        <p>{selectedRow != null ? "Adresa s PSC " + selectedRow.PSC : ""}</p>
        <p>ZŤP</p>
        <p>Nadchádzajúca udalosť</p>
      </Dialog> */}
      <TabPatients></TabPatients>
    </div>
  );
}

export default Patient;
