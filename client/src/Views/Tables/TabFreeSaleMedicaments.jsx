import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";

export default function TabFreeSaleMedicaments() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [volnyPredajLiekov, setVolnyPredajLiekov] = useState([]);
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);
  const [vydajPocet, setVydajPocet] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(
      `/lekarenskySklad/volnyPredajLiekov/${userDataHelper.UserInfo.userid}`,
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
        setVolnyPredajLiekov(data);
        if (data.length > 0) {
          setNazovLekarne(data[0].NAZOV_LEKARNE);
        }
      });
  }, []);

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const updatePocetLiekov = async (
    idLekarne,
    idLiek,
    datumTrvanlivosti,
    vydanyPocet
  ) => {
    try {
      setIsLoading(true); // Začiatok načítania
      const response = await fetch(
        "/lekarenskySklad/updatePocetVolnopredajnehoLieku",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("hospit-user")}`,
          },
          body: JSON.stringify({
            idLekarne,
            idLiek,
            datumTrvanlivosti,
            vydanyPocet,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      setIsLoading(false); // Koniec načítania
      return true;
    } catch (error) {
      setIsLoading(false); // Koniec načítania
      toast.current.show({
        severity: "error",
        summary: "Chyba pri aktualizácii",
        detail: error.toString(),
        life: 3000,
      });
      return false;
    }
  };

  const onSubmit = async () => {
    if (vydajPocet > 0 && vydajPocet <= selectedRow.POCET) {
      const success = await updatePocetLiekov(
        selectedRow.ID_LEKARNE,
        selectedRow.ID_LIEK,
        selectedRow.DATUM_TRVANLIVOSTI,
        vydajPocet
      );

      if (success) {
        setShowDialog(false);
        setVydajPocet(1); // Reset počtu na výdaj

        //@TODO Toto sa odstrani len z tabulky lokalne, ale vdatabaze zaznam stale ostane, treba riesit DELETE
        // Ak po vydaji bude pocet liekov 0, odstránime liek zo zoznamu
        if (selectedRow.POCET - vydajPocet === 0) {
          setVolnyPredajLiekov((prevData) =>
            prevData.filter((liek) => liek.ID_LIEK !== selectedRow.ID_LIEK)
          );
        } else {
          // Inak aktualizujeme pocet liekov v stave
          setVolnyPredajLiekov((prevData) =>
            prevData.map((liek) =>
              liek.ID_LIEK === selectedRow.ID_LIEK
                ? { ...liek, POCET: liek.POCET - vydajPocet }
                : liek
            )
          );
        }
        toast.current.show({
          severity: "success",
          summary: "Liek vydaný",
          detail: `Liek ${selectedRow.NAZOV_LIEKU} bol úspešne vydaný v počte ${vydajPocet} ks.`,
          life: 6000,
        });
      }
    } else {
      toast.current.show({
        severity: "error",
        summary: "Neplatné množstvo",
        detail: "Zadané množstvo presahuje dostupné zásoby alebo je záporné!",
        life: 6000,
      });
    }
  };

  const handleClick = (value) => {
    setShowDialog(true);
    setSelectedRow(value);
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label="Vydať"
          icon="pi pi-shopping-cart"
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
              Voľný predaj liekov v lekárni:
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
          label="Dostupnosť skladu"
          icon="pi pi-external-link"
          onClick={() => navigate("/lekarensky_sklad_lieky")}
        />
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
        <DataTable
          value={volnyPredajLiekov}
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
            "NAZOV_LIEKU",
            "UCINNA_LATKA",
            "NA_PREDPIS",
            "DATUM_TRVANLIVOSTI",
            "POCET",
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="NAZOV_LIEKU" header={"Názov lieku"} filter></Column>
          <Column field="UCINNA_LATKA" header={"Účinná látka"} filter></Column>
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
              {/* Pridanie vstupného poľa pre zadanie počtu liekov na výdaj */}
              <InputText
                value={vydajPocet}
                onChange={(e) => setVydajPocet(e.target.value)}
                placeholder="Zadajte počet na výdaj"
                type="number"
                max={selectedRow.POCET}
              />
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
