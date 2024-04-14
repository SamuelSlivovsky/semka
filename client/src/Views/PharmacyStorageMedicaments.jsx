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
import { ProgressSpinner } from "primereact/progressspinner";

export default function PharmacyStorageMedicaments() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [liekyLekarenskySklad, setLiekyLekarenskySklad] = useState([]);
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(
      `/lekarenskySklad/lekarenskySkladLieky/${userDataHelper.UserInfo.userid}`,
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
        processMedicationsData(data);
        setLiekyLekarenskySklad(data);
        if (data.length > 0) {
          setNazovLekarne(data[0].NAZOV_LEKARNE);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          <span className="p-input-icon-left">
            <i className="pi pi-search" style={{ color: "#00796b" }} />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať"
              style={{ borderRadius: "20px", borderColor: "#00796b" }}
            />
          </span>
          <div className="ml-4">
            <h2
              style={{
                color: "#00796b",
                borderBottom: "2px solid #004d40",
                paddingBottom: "5px",
                marginBottom: "10px",
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Lieky dostupné na sklade v lekárni:
            </h2>
            <h3
              style={{
                backgroundColor: "#b3ffda",
                color: "#004d40",
                padding: "10px",
                borderRadius: "8px",
                display: "inline-block",
                boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
              }}
            >
              {nazovLekarne}
            </h3>
          </div>
        </div>
        <div className="flex flex-column">
          <Button
            style={{ marginBottom: "10px" }} // add margin to separate the buttons
            label="Objednať lieky"
            icon="pi pi-upload"
            onClick={() => navigate("/objednavky")}
          />
          <Button
            label="Spravovať sklad"
            icon="pi pi-cog"
            onClick={() => navigate("/sklad")}
          />
        </div>
      </div>
    );
  };

  const processMedicationsData = (medications) => {
    const lowQuantityMeds = medications.filter((med) => med.POCET <= 10);
    const expiringSoonMeds = medications.filter((med) =>
      isExpiringSoon(med.DATUM_TRVANLIVOSTI)
    );
    const expiredMeds = medications.filter((med) =>
      isExpired(med.DATUM_TRVANLIVOSTI)
    );

    if (lowQuantityMeds.length > 0) {
      const lowStockDetails = lowQuantityMeds.map((med) => (
        <React.Fragment key={med.ID}>
          {med.NAZOV_LIEKU}: ({med.POCET} ks)
          <br />
          <br />
        </React.Fragment>
      ));

      toast.current.show({
        severity: "warn",
        summary: "Upozornenie na nízke zásoby!",
        detail: (
          <div>
            <strong>Nasledujúce lieky majú nízky stav zásob:</strong>
            <br />
            <br />
            {lowStockDetails}
          </div>
        ),
        sticky: true, // if you want it to remain until manually closed
      });
    }

    if (expiringSoonMeds.length > 0) {
      const expiringDetails = expiringSoonMeds.map((med) => (
        <React.Fragment key={med.ID}>
          {med.NAZOV_LIEKU}: (Expirácia: {med.DATUM_TRVANLIVOSTI})
          <br />
          <br />
        </React.Fragment>
      ));

      toast.current.show({
        severity: "warn",
        summary: "Upozornenie na blížiacu sa expiráciu",
        detail: (
          <div>
            <strong>Čoskoro sa končí trvanlivosť týchto liekov:</strong>
            <br />
            <br />
            {expiringDetails}
          </div>
        ),
        sticky: true, // if you want it to remain until manually closed
      });
    }

    if (expiredMeds.length > 0) {
      const expiredDetails = expiredMeds.map((med) => (
        <React.Fragment key={med.ID}>
          {med.NAZOV_LIEKU}: (Expirácia: {med.DATUM_TRVANLIVOSTI})
          <br />
          <br />
        </React.Fragment>
      ));

      toast.current.show({
        severity: "error",
        summary: "Lieky s prekročenou expiráciou!",
        detail: (
          <div>
            <strong>Tieto lieky už majú prekročenú dobu použiteľnosti:</strong>
            <br />
            <br />
            {expiredDetails}
          </div>
        ),
        sticky: true,
      });
    }
  };

  function parseDate(str) {
    const [day, month, year] = str.split(".");
    return new Date(year, month - 1, day); // month - 1 because months are 0-indexed
  }

  const isExpiringSoon = (expiryDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const twoWeeksFromNow = new Date(today);
    twoWeeksFromNow.setDate(today.getDate() + 14); // Set the date to 14 days from now

    const expiryDate = parseDate(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0);

    return expiryDate >= today && expiryDate <= twoWeeksFromNow;
  };

  const isExpired = (expiryDateStr) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiryDate = parseDate(expiryDateStr);
    expiryDate.setHours(0, 0, 0, 0);

    return expiryDate < today;
  };

  const quantityBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        {rowData.POCET}
        {rowData.POCET <= 10 && (
          <i
            className="pi pi-exclamation-triangle"
            style={{ color: "red", marginLeft: "10px" }}
          />
        )}
      </React.Fragment>
    );
  };

  const expirationBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <span
          style={{
            color: isExpired(rowData.DATUM_TRVANLIVOSTI) ? "red" : "inherit",
          }}
        >
          {rowData.DATUM_TRVANLIVOSTI}
          {isExpiringSoon(rowData.DATUM_TRVANLIVOSTI) &&
            !isExpired(rowData.DATUM_TRVANLIVOSTI) && (
              <i
                className="pi pi-exclamation-triangle"
                style={{ color: "red", marginLeft: "10px" }}
              />
            )}
          {isExpired(rowData.DATUM_TRVANLIVOSTI) && (
            <i
              className="pi pi-times"
              style={{ color: "red", marginLeft: "10px" }}
            />
          )}
        </span>
      </React.Fragment>
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
      NAZOV_LIEKU: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      UCINNA_LATKA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      NA_PREDPIS: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
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
            value={liekyLekarenskySklad}
            responsiveLayout="scroll"
            selectionMode="single"
            paginator
            rows={15}
            selection={selectedRow}
            // onSelectionChange={(e) => handleClick(e.value)}
            header={header}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "NAZOV_LIEKU",
              "UCINNA_LATKA",
              "NA_PREDPIS",
              "DATUM_TRVANLIVOSTI",
              "POCET",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column field="NAZOV_LIEKU" header={"Názov lieku"} filter></Column>
            <Column
              field="UCINNA_LATKA"
              header={"Účinná látka"}
              filter
            ></Column>
            <Column
              field="NA_PREDPIS"
              header={"Výdaj"}
              body={(rowData) =>
                rowData.NA_PREDPIS === "A" ? "Na predpis" : "Voľnopredajný"
              }
              filter
            ></Column>
            <Column
              field="DATUM_TRVANLIVOSTI"
              header="Dátum expirácie"
              body={expirationBodyTemplate}
              filter
            ></Column>
            <Column
              field="POCET"
              header="Ks na sklade"
              body={quantityBodyTemplate}
              filter
            ></Column>
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
      ></Dialog>
    </div>
  );
}
