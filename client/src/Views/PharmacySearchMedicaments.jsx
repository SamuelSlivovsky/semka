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

export default function PharmacySearchMedicaments(props) {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [searchLiekyLekarenskySklad, setSearchLiekyLekarenskySklad] = useState(
    []
  );
  const navigate = useNavigate();
  const [idSkladu, setIdSkladu] = useState([]);
  const [idLieku, setIdLieku] = useState([]);
  const [datumTrvanlivosti, setDatumTrvanlivosti] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newReservation, setNewReservation] = useState({});
  const [submitted, setSubmitted] = useState(false); //sluzi na to, ze polia v addForm musia byt required

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetchGetLiekyPodlaLekarne(headers, userDataHelper);
  }, []);

  const fetchGetLiekyPodlaLekarne = (headers, userDataHelper) => {
    fetch(
      `/lekarenskySklad/lekarenskySkladVyhladavnieLieciva/${userDataHelper.UserInfo.userid}`,
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
        setSearchLiekyLekarenskySklad(data);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const fetchSubmitNewReservation = () => {
    const reservationData = {
      ...newReservation,
      id_sklad: idSkladu,
      id_liek: idLieku,
      datum_trvanlivosti: datumTrvanlivosti,
    };
    console.log(reservationData);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    };

    fetch("/pharmacyManagers/insertRezervaciaLieku", {
      method: "POST",
      headers: headers,
      body: JSON.stringify(reservationData),
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
          summary: "Rezervácia bola vytvorená",
          detail: "Nová rezervácia lieku v lekárni bola úspešne vytvorená.",
          life: 5000,
        });
        setShowAddDialog(false); // Zavrie dialogové okno po úspešnom pridaní
        setNewReservation({}); // Resetuje stav formulára
        fetchGetLiekyPodlaLekarne(headers, GetUserData(token));
      })
      .catch((error) => {
        console.error("There was a problem with the fetch operation:", error);
        toast.current.show({
          severity: "error",
          summary: "Chyba pri vytváraní rezervácie",
          detail: "Nepodarilo sa vytvoriť rezerváciu.",
          life: 5000,
        });
      });
  };

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const onSubmit = () => {
    setShowDialog(false);
    setShowAddDialog(true);
  };

  const handleClick = (value) => {
    //moznost kliknut a otvori dialog iba v pripade, ze liek je volnopredajny
    if (value && value.NA_PREDPIS === "N") {
      setShowDialog(true);
      setSelectedRow(value);
      setIdSkladu(value.ID_SKLAD);
      setIdLieku(value.ID_LIEK);
      setDatumTrvanlivosti(value.DATUM_TRVANLIVOSTI);
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Upozornenie",
        detail: "Rezervácia je možné len pre voľnopredajné lieky.",
        life: 5000,
      });
    }
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="Rezervovať"
          icon="pi pi-cart-plus"
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
              Vyhľadávanie lekárne, ktorá má liek skladom
            </h2>
          </div>
        </div>
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
    // Pridáme kontrolu na počet
    const requestedCount = parseInt(newReservation.pocet, 10); // získame počet ako číslo
    const availableCount = parseInt(selectedRow.POCET, 10); // dostupný počet na sklade

    if (
      newReservation.rod_cislo &&
      newReservation.meno &&
      newReservation.priezvisko &&
      requestedCount > 0
    ) {
      if (requestedCount > availableCount) {
        // Ak je požadovaný počet väčší než dostupný
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Presiahli ste dostupný počet kusov na sklade.",
          life: 5000,
        });
      } else {
        // Ak je všetko v poriadku, pokračujeme v odoslaní
        fetchSubmitNewReservation();
      }
    } else if (requestedCount <= 0) {
      // Ak je zadaný záporný počet
      toast.current.show({
        severity: "error",
        summary: "Neplatná hodnota",
        detail: "Počet kusov musí byť kladné číslo.",
        life: 5000,
      });
    } else {
      // Ak nie sú vyplnené všetky povinné polia
      toast.current.show({
        severity: "warn",
        summary: "Nevyplnené povinné polia",
        detail: "Prosím, vyplňte všetky povinné polia.",
        life: 5000,
      });
    }
  };

  const renderErrorMessage = (fieldName) => {
    return (
      submitted &&
      !newReservation[fieldName] && (
        <small className="p-error">Toto pole je povinné!</small>
      )
    );
  };

  // Form dialog for adding a new reservation
  const renderAddReservationDialog = () => {
    return (
      <Dialog
        visible={showAddDialog}
        style={{ width: "450px" }}
        header="Vytvoriť rezerváciu lieku v lekárni"
        modal
        className="p-fluid"
        onHide={() => setShowAddDialog(false)}
      >
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="rodneCislo">Rodné číslo</label>
          <InputText
            id="rodneCislo"
            value={newReservation.rod_cislo}
            onChange={(e) =>
              setNewReservation({
                ...newReservation,
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
            value={newReservation.meno}
            onChange={(e) =>
              setNewReservation({ ...newReservation, meno: e.target.value })
            }
            placeholder="Zadajte meno"
            required
          />
          {renderErrorMessage("meno")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="priezvisko">Priezvisko</label>
          <InputText
            id="priezvisko"
            value={newReservation.priezvisko}
            onChange={(e) =>
              setNewReservation({
                ...newReservation,
                priezvisko: e.target.value,
              })
            }
            placeholder="Zadajte priezvisko"
            required
          />
          {renderErrorMessage("priezvisko")}
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="ulica">Telefón</label>
          <InputText
            id="telefon"
            value={newReservation.telefon}
            onChange={(e) =>
              setNewReservation({ ...newReservation, telefon: e.target.value })
            }
            placeholder="Zadajte telefónne číslo (Nepovinné)"
          />
        </div>
        <div className="p-field" style={{ marginTop: "1rem" }}>
          <label htmlFor="ulica">E - mail</label>
          <InputText
            id="email"
            value={newReservation.email}
            onChange={(e) =>
              setNewReservation({ ...newReservation, email: e.target.value })
            }
            placeholder="Zadajte e - mail (Nepovinné)"
          />
        </div>
        <div className="p-field" style={{ marginTop: "4rem" }}>
          <label htmlFor="pocet">Počet</label>
          <InputText
            id="pocet"
            value={newReservation.pocet}
            onChange={(e) =>
              setNewReservation({ ...newReservation, pocet: e.target.value })
            }
            placeholder="Zadajte počet kusov"
            type="number"
            required
          />
          {renderErrorMessage("pocet")}
        </div>
        <Button
          style={{ marginTop: "50px" }}
          label="Rezervovať"
          icon="pi pi-check"
          onClick={() => {
            handleSubmit();
          }}
        />
      </Dialog>
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
      NAZOV_LEKARNE: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
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
      {renderAddReservationDialog()}
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
            value={searchLiekyLekarenskySklad}
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
              "NAZOV_LEKARNE",
              "NAZOV_LIEKU",
              "UCINNA_LATKA",
              "NA_PREDPIS",
              "DATUM_TRVANLIVOSTI",
              "POCET",
            ]}
            emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
          >
            <Column
              field="NAZOV_LEKARNE"
              header={"Názov lekárne"}
              filter
            ></Column>
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
              header={"Dátum expirácie"}
              filter
            ></Column>
            <Column field="POCET" header={"Ks na sklade"} filter></Column>
          </DataTable>
        )}
      </div>
      <Dialog
        header={
          selectedRow != null ? (
            <div
              style={{
                margin: "auto",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              {selectedRow.NAZOV_LEKARNE}
              <br />
              <h5>{selectedRow.NAZOV_LIEKU}</h5>
            </div>
          ) : (
            ""
          )
        }
        visible={showDialog}
        style={{ width: "50vw" }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      ></Dialog>
    </div>
  );
}
