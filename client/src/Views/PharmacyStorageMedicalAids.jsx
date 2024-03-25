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

export default function PharmacyStorageMedicalAids() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [zdrPomockyLekarenskySklad, setZdrPomockyLekarenskySklad] = useState(
    []
  );
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(
      `/lekarenskySklad/lekarenskySkladZdrPomocky/${userDataHelper.UserInfo.userid}`,
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
        processMedicalAidsData(data);
        setZdrPomockyLekarenskySklad(data);
        console.log(data);
        if (data.length >= 0) {
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
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder="Vyhľadať"
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
              Zdravotnícke pomôcky dostupné na sklade v lekárni:
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
        <Button
          style={{ height: "50px", top: "10px", right: "10px" }}
          label="Objednať zdr. pomôcky"
          icon="pi pi-upload"
          onClick={() => navigate("/presuny")}
        />
      </div>
    );
  };

  const processMedicalAidsData = (medicalAids) => {
    const lowQuantityAids = medicalAids.filter((aid) => aid.POCET <= 10);
    const expiringSoonAids = medicalAids.filter((aid) =>
      isExpiringSoon(aid.DATUM_TRVANLIVOSTI)
    );

    if (lowQuantityAids.length > 0) {
      const lowStockDetails = lowQuantityAids.map((aid) => (
        <React.Fragment key={aid.ID}>
          {aid.NAZOV_ZDR_POMOCKY}: ({aid.POCET} ks)
          <br />
          <br />
        </React.Fragment>
      ));

      toast.current.show({
        severity: "warn",
        summary: "Upozornenie na nízke zásoby!",
        detail: (
          <div>
            <strong>
              Nasledujúce zdravotnícke pomôcky majú nízky stav zásob:
            </strong>
            <br />
            <br />
            {lowStockDetails}
          </div>
        ),
        sticky: true, // if you want it to remain until manually closed
      });
    }

    if (expiringSoonAids.length > 0) {
      const expiringDetails = expiringSoonAids.map((aid) => (
        <React.Fragment key={aid.ID}>
          {aid.NAZOV_ZDR_POMOCKY}: (Expirácia: {aid.DATUM_TRVANLIVOSTI})
          <br />
          <br />
        </React.Fragment>
      ));

      toast.current.show({
        severity: "warn",
        summary: "Upozornenie na blížiacu sa expiráciu",
        detail: (
          <div>
            <strong>
              Čoskoro sa končí trvanlivosť týchto zdravotníckych pomôcok:
            </strong>
            <br />
            <br />
            {expiringDetails}
          </div>
        ),
        sticky: true, // if you want it to remain until manually closed
      });
    }
  };

  //Expiracia zdr. pomocky nastane za 14 dni alebo menej
  function isSameOrBeforeToday(date1, date2) {
    return (
      date1.getFullYear() <= date2.getFullYear() &&
      date1.getMonth() <= date2.getMonth() &&
      date1.getDate() <= date2.getDate()
    );
  }

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

    return isSameOrBeforeToday(expiryDate, twoWeeksFromNow);
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
        {rowData.DATUM_TRVANLIVOSTI}
        {isExpiringSoon(rowData.DATUM_TRVANLIVOSTI) && (
          <i
            className="pi pi-exclamation-triangle"
            style={{ color: "red", marginLeft: "10px" }}
          />
        )}
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
      NAZOV_ZDR_POMOCKY: {
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
            value={zdrPomockyLekarenskySklad}
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
              "NAZOV_ZDR_POMOCKY",
              "DATUM_TRVANLIVOSTI",
              "POCET",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column
              field="NAZOV_ZDR_POMOCKY"
              header={"Názov zdravotníckej pomôcky"}
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
        // footer={renderDialogFooter()}
        // onHide={() => onHide()}
      ></Dialog>
    </div>
  );
}
