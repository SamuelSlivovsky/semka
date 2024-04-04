import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate, useLocation } from "react-router";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";

export default function TabPharmacists(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [lekarnici, setLekarnici] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);
  const [idLekarne, setIdLekarne] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPharmacist, setNewPharmacist] = useState({});
  const [cities, setCities] = useState([]);
  const [submitted, setSubmitted] = useState(false); //sluzi na to, ze polia v addForm musia byt required

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetchGetLekarnici(headers, userDataHelper);
    fetchGetZoznamMiest(headers);
  }, []);

  const fetchGetLekarnici = (headers, userDataHelper) => {
    fetch(`/pharmacyManagers/lekarnici/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
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
        setLekarnici(data);
        console.log(data);
        if (data.length > 0) {
          setNazovLekarne(data[0].LEKAREN_NAZOV);
          setIdLekarne(data[0].ID_LEKARNE);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchGetZoznamMiest = (headers) => {
    fetch(
      `pharmacyManagers/getZoznamMiest/${
        typeof props.cityId !== "undefined" && props.cityId !== null
          ? props.cityId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setCities(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching zoznam miest:", error);
      });
  };

  const fetchSubmitNewPharmacist = () => {
    const pharmacistData = {
      ...newPharmacist,
      id_lekarne: idLekarne,
      psc: newPharmacist.psc.PSC,
    };
    console.log(pharmacistData);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    fetch("/pharmacyManagers/insertZamestnanecLekarne", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(pharmacistData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
        throw new Error("Network response was not ok.");
      })
      .then((data) => {
        toast.current.show({
          severity: "success",
          summary: "Zamestnanec pridaný",
          detail: "Nový lekárnik bol úspešne pridaný do systému.",
          life: 3000,
        });
        setShowAddDialog(false); // Zavrie dialogové okno po úspešnom pridaní
        setNewPharmacist({}); // Resetuje stav formulára
        fetchGetLekarnici(headers, GetUserData(token)); // Znovu načíta zoznam lekárnikov po pridaní nového
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri pridávaní",
          detail: "Nepodarilo sa pridať nového lekárnika.",
          life: 3000,
        });
      });
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const onSubmit = () => {
    setShowDialog(false);
    navigate("/pharmacist", { state: selectedRow.CISLO_ZAM });
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
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
          label="Detail"
          icon="pi pi-check"
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

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
              Zoznam lekárnikov pracujúcich v lekárni:
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
          label="Pridať lekárnika"
          icon="pi pi-plus"
          onClick={() => setShowAddDialog(true)}
        />
      </div>
    );
  };

  const formatRodneCislo = (value) => {
    // Odstráňte všetky znaky okrem čísel a lomiek
    let cislo = value.replace(/[^\d/]/g, "");

    // Odstráňte všetky lomky, ktoré sú na zlom mieste
    cislo = cislo.replace(/[/]/g, "");

    // Uistite sa, že lomka je pridávaná iba raz
    if (cislo.length > 6) {
      cislo = `${cislo.slice(0, 6)}/${cislo.slice(6)}`;
    }

    // Orezanie akéhokoľvek nadbytočného textu
    if (cislo.length > 11) {
      cislo = cislo.slice(0, 11);
    }

    return cislo;
  };

  const handleSubmit = () => {
    setSubmitted(true); // Nastavíme, že bol formulár pokusom odoslaný
    if (
      newPharmacist.rod_cislo &&
      newPharmacist.meno &&
      newPharmacist.priezvisko &&
      newPharmacist.ulica &&
      newPharmacist.psc
    ) {
      // Ak sú všetky polia vyplnené, pokračujeme v odoslaní
      fetchSubmitNewPharmacist();
    }
  };

  const renderErrorMessage = (fieldName) => {
    return (
      submitted &&
      !newPharmacist[fieldName] && (
        <small className="p-error">Toto pole je povinné!</small>
      )
    );
  };

  // Form dialog for adding a new pharmacist
  const renderAddPharmacistDialog = () => {
    return (
      <Dialog
        visible={showAddDialog}
        style={{ width: "450px" }}
        header="Nový lekárnik"
        modal
        className="p-fluid"
        onHide={() => setShowAddDialog(false)}
      >
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="rodneCislo">Rodné číslo</label>
          <InputText
            id="rodneCislo"
            value={newPharmacist.rod_cislo}
            onChange={(e) =>
              setNewPharmacist({
                ...newPharmacist,
                rod_cislo: formatRodneCislo(e.target.value),
              })
            }
            placeholder="______/____"
            maxLength={11}
            required
          />
          {renderErrorMessage("rod_cislo")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="meno">Meno</label>
          <InputText
            id="meno"
            value={newPharmacist.meno}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, meno: e.target.value })
            }
            placeholder="Zadajte meno lekárnika"
            required
          />
          {renderErrorMessage("meno")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="priezvisko">Priezvisko</label>
          <InputText
            id="priezvisko"
            value={newPharmacist.priezvisko}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, priezvisko: e.target.value })
            }
            placeholder="Zadajte priezvisko lekárnika"
            required
          />
          {renderErrorMessage("priezvisko")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="ulica">Ulica</label>
          <InputText
            id="ulica"
            value={newPharmacist.ulica}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, ulica: e.target.value })
            }
            placeholder="Zadajte názov ulice"
            required
          />
          {renderErrorMessage("ulica")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="city">Mesto</label>
          <Dropdown
            id="city"
            value={newPharmacist.psc}
            options={cities}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, psc: e.value })
            }
            optionLabel="NAZOV" // Assuming your city objects have a 'name' property
            placeholder="Vyberte mesto"
            required
          />
          {renderErrorMessage("psc")}
        </div>
        <Button
          style={{ marginTop: "50px" }}
          label="Pridať"
          icon="pi pi-check"
          onClick={() => {
            handleSubmit();
          }}
        />
      </Dialog>
    );
  };

  // Function to render Edit and Delete buttons
  const actionBodyTemplate = (rowData) => {
    return (
      <React.Fragment>
        <Button
          icon="pi pi-pencil"
          className="p-button-rounded p-button-warning mr-2"
          onClick={() => editPharmacist(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => requestDeletePharmacist(rowData)}
        />
      </React.Fragment>
    );
  };

  //@TODO Add these functions to handle edit and delete actions
  const editPharmacist = () => {
    // Implementation for editing pharmacist
  };

  const deletePharmacist = (rowData) => {
    console.log(rowData.CISLO_ZAM);
    const token = localStorage.getItem("hospit-user");
    fetch(`/pharmacyManagers/deleteZamestnanciLekarne/${rowData.CISLO_ZAM}`, {
      method: "DELETE",
      headers: {
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => {
        if (response.ok) {
          toast.current.show({
            severity: "success",
            summary: "Zamestnanec vymazaný",
            detail: "Zamestnanec bol úspešne vymazaný.",
            life: 3000,
          });
          // Aktualizujte zoznam zamestnancov po úspešnom vymazaní
          // Možno budete potrebovať prispôsobiť túto časť, aby správne načítala dáta
          fetchGetLekarnici(
            { authorization: "Bearer " + token },
            GetUserData(token)
          );
        } else {
          throw new Error("Problém pri vymazávaní zamestnanca");
        }
      })
      .catch((error) => {
        console.error("Chyba:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri vymazávaní",
          detail: "Nepodarilo sa vymazať zamestnanca.",
          life: 3000,
        });
      });

    // Zavrie potvrdzovací dialóg
    setShowConfirmDialog(false);
  };

  const requestDeletePharmacist = (rowData) => {
    setSelectedRow(rowData); // Uložíme si vybraného zamestnanca do stavu
    setShowConfirmDialog(true); // Zobrazíme potvrdzovací dialog
  };

  const renderConfirmDialog = () => {
    return (
      <Dialog
        header="Potvrdenie vymazania"
        visible={showConfirmDialog}
        style={{ width: "450px", textAlign: "center" }}
        modal
        footer={confirmDialogFooter}
        onHide={() => setShowConfirmDialog(false)}
      >
        <div
          className="confirmation-content"
          style={{ textAlign: "center", display: "grid" }}
        >
          <i
            className="pi pi-exclamation-triangle"
            style={{
              fontSize: "2rem",
              color: "var(--yellow-500)",
              marginBottom: "1rem",
            }}
          ></i>
          <span style={{ marginBottom: "1rem" }}>
            Naozaj chcete vymazať zamestnanca: {selectedRow?.MENO}{" "}
            {selectedRow?.PRIEZVISKO}?
          </span>
        </div>
      </Dialog>
    );
  };

  const confirmDialogFooter = (
    <div style={{ display: "flex", justifyContent: "center" }}>
      <Button
        label="Nie"
        icon="pi pi-times"
        className="p-button-text"
        onClick={() => setShowConfirmDialog(false)}
      />
      <Button
        label="Áno"
        icon="pi pi-check"
        className="p-button-text"
        onClick={() => deletePharmacist(selectedRow)}
      />
    </div>
  );

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
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      CISLO_ZAM: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <div>
      {renderConfirmDialog()}
      <Toast ref={toast} position="top-center" />
      {renderAddPharmacistDialog()}
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
            value={lekarnici}
            responsiveLayout="scroll"
            selectionMode="single"
            paginator
            rows={15}
            selection={selectedRow}
            onSelectionChange={(e) => handleClick(e.value)}
            header={header}
            filters={filters}
            filterDisplay="menu"
            globalFilterFields={[
              "ROD_CISLO",
              "MENO",
              "PRIEZVISKO",
              "CISLO_ZAM",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column field="ROD_CISLO" header={"Rodné číslo"} filter></Column>
            <Column field="MENO" header={"Meno"} filter></Column>
            <Column field="PRIEZVISKO" header={"Priezvisko"} filter></Column>
            <Column field="CISLO_ZAM" header={"ID zamestnanca"} filter></Column>
            <Column body={actionBodyTemplate} header=""></Column>
          </DataTable>
        )}
      </div>
      <Dialog
        header={
          selectedRow != null
            ? "Lekárnik: " + selectedRow.MENO + " " + selectedRow.PRIEZVISKO
            : ""
        }
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      ></Dialog>
    </div>
  );
}
