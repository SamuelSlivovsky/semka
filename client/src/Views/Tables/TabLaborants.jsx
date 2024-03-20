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

export default function TabLaborants(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [laboranti, setLaboranti] = useState([]);
  const location = useLocation();
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);
  const [idLekarne, setIdLekarne] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newLaborant, setNewLaborant] = useState({});
  const [cities, setCities] = useState([]);
  const [submitted, setSubmitted] = useState(false); //sluzi na to, ze polia v addForm musia byt required

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetchGetLaboranti(headers, userDataHelper);
    fetchGetZoznamMiest(headers);
  }, []);

  const fetchGetLaboranti = (headers, userDataHelper) => {
    fetch(`/pharmacyManagers/laboranti/${userDataHelper.UserInfo.userid}`, {
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
        setLaboranti(data);
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
        console.error("Error fetching ucinne latky:", error);
      });
  };

  const fetchSubmitNewLaborant = () => {
    const laborantData = {
      ...newLaborant,
      id_lekarne: idLekarne,
      psc: newLaborant.psc.PSC,
    };
    console.log(laborantData);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    fetch("/pharmacyManagers/insertLaborantLekarne", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(laborantData),
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
          summary: "Úspešne pridaný",
          detail: "Nový laborant bol úspešne pridaný do systému.",
          life: 3000,
        });
        setShowAddDialog(false); // Zavrie dialogové okno po úspešnom pridaní
        setNewLaborant({}); // Resetuje stav formulára
        fetchGetLaboranti(headers, GetUserData(token)); // Znovu načíta zoznam lekárnikov po pridaní nového
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri pridávaní",
          detail: "Nepodarilo sa pridať nového laboranta.",
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
    navigate("/laborant", { state: selectedRow.CISLO_ZAM });
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
            <h2>Zoznam laborantov pracujúcich v lekárni: </h2>
            <h3>{nazovLekarne}</h3>
          </div>
        </div>
        <Button
          style={{ height: "50px" }}
          label="Pridať laboranta"
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
      newLaborant.rod_cislo &&
      newLaborant.meno &&
      newLaborant.priezvisko &&
      newLaborant.ulica &&
      newLaborant.psc
    ) {
      // Ak sú všetky polia vyplnené, pokračujeme v odoslaní
      fetchSubmitNewLaborant();
    }
  };

  const renderErrorMessage = (fieldName) => {
    return (
      submitted &&
      !newLaborant[fieldName] && (
        <small className="p-error">Toto pole je povinné!</small>
      )
    );
  };

  // Form dialog for adding a new pharmacist
  const renderAddLaborantDialog = () => {
    return (
      <Dialog
        visible={showAddDialog}
        style={{ width: "450px" }}
        header="Nový laborant"
        modal
        className="p-fluid"
        onHide={() => setShowAddDialog(false)}
      >
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="rodneCislo">Rodné číslo</label>
          <InputText
            id="rodneCislo"
            value={newLaborant.rod_cislo}
            onChange={(e) =>
              setNewLaborant({
                ...newLaborant,
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
            value={newLaborant.meno}
            onChange={(e) =>
              setNewLaborant({ ...newLaborant, meno: e.target.value })
            }
            placeholder="Zadajte meno laboranta"
            required
          />
          {renderErrorMessage("meno")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="priezvisko">Priezvisko</label>
          <InputText
            id="priezvisko"
            value={newLaborant.priezvisko}
            onChange={(e) =>
              setNewLaborant({ ...newLaborant, priezvisko: e.target.value })
            }
            placeholder="Zadajte priezvisko laboranta"
            required
          />
          {renderErrorMessage("priezvisko")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="ulica">Ulica</label>
          <InputText
            id="ulica"
            value={newLaborant.ulica}
            onChange={(e) =>
              setNewLaborant({ ...newLaborant, ulica: e.target.value })
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
            value={newLaborant.psc}
            options={cities}
            onChange={(e) => setNewLaborant({ ...newLaborant, psc: e.value })}
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
          onClick={() => editLaborant(rowData)}
        />
        <Button
          icon="pi pi-trash"
          className="p-button-rounded p-button-danger"
          onClick={() => requestDeleteLaborant(rowData)}
        />
      </React.Fragment>
    );
  };

  // Add these functions to handle edit and delete actions
  const editLaborant = (pharmacist) => {
    // Implementation for editing pharmacist
  };

  const deleteLaborant = (rowData) => {
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
          fetchGetLaboranti(
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

  const requestDeleteLaborant = (rowData) => {
    setSelectedRow(rowData); // Uložíme si vybraného zamestnanca do stavu
    setShowConfirmDialog(true); // Zobrazíme potvrdzovací dialog
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
          div
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
        onClick={() => deleteLaborant(selectedRow)}
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
      {renderAddLaborantDialog()}
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
            value={laboranti}
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
            ? selectedRow.MENO + " " + selectedRow.PRIEZVISKO
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
