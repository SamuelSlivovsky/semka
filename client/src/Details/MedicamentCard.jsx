import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useNavigate, useLocation } from "react-router";
import { Toast } from "primereact/toast";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { InputText } from "primereact/inputtext";

export default function MedicamentCard(props) {
  const [detail, setDetail] = useState("");
  const [ucinneLatky, setUcinneLatky] = useState("");
  const [displayDialogForInsert, setDisplayDialogForInsert] = useState(false);
  const [displayDialogForUpdate, setDisplayDialogForUpdate] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null); // Added state for selected substance
  const toast = useRef(null);
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetchMedicamentDetail(headers);
    fetchUcinnaLatka(headers);
  }, []);

  const fetchMedicamentDetail = (headers) => {
    fetch(
      `pharmacyManagers/detailLieku/${
        typeof props.medicamentId !== "undefined" && props.medicamentId !== null
          ? props.medicamentId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetail(...data);
        console.log(data);
      });
  };

  const fetchUcinnaLatka = (headers) => {
    fetch(
      `pharmacyManagers/getUcinnaLatka/${
        typeof props.substanceId !== "undefined" && props.substanceId !== null
          ? props.substanceId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setUcinneLatky(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching ucinne latky:", error);
      });
  };

  const redirect = () => {
    navigate("/medicaments");
  };

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na číselník liekov"
          icon="pi pi-replay"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={() => redirect()}
        />
      </div>
    );
  };

  const renderCardFooter = () => {
    if (detail && detail.NAZOV_UCINNEJ_LATKY) {
      return (
        <div>
          <Button
            label="Spravovať účinnú látku"
            icon="pi pi-file-edit"
            className="p-button-rounded p-button-outlined p-button-raised p-button-warning"
            style={{ marginTop: "75px" }}
            onClick={() => setDisplayDialogForUpdate(true)} // Open dialog when Edit button is clicked
          />
        </div>
      );
    } else {
      return (
        <div>
          <Button
            label="Pridať účinnú látku"
            icon="pi pi-plus"
            className="p-button-rounded p-button-outlined p-button-raised p-button-success"
            style={{ marginTop: "75px" }}
            onClick={() => setDisplayDialogForInsert(true)} // Open dialog when Edit button is clicked
          />
        </div>
      );
    }
  };

  const renderDetail = (label, value) => (
    <div className="flex w-100">
      <div className="col-6 m-0">
        <h3 className="ml-10">{label}</h3>
      </div>
      <div className="col-6 m-0">
        <h4 style={{ color: "gray" }}>{value}</h4>
      </div>
    </div>
  );

  const renderDialogHeader = () => {
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
            <h2>Účinné látky</h2>
          </div>
        </div>
      </div>
    );
  };

  const handleSubstanceSelectUpdate = (event) => {
    console.log(event.ID_UCINNA_LATKA);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    fetch(`pharmacyManagers/updateUcinnaLatka`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        id_liek: detail.ID_LIEK,
        id_ucinna_latka: event.ID_UCINNA_LATKA,
      }),
    }).then((res) => {
      if (res.ok) {
        toast.current.show({
          severity: "success",
          summary: "Úspech",
          detail: "Účinná látka lieku bola aktualizovaná!",
        });
        setDisplayDialogForUpdate(false);
        setTimeout(() => {
          redirect();
        }, 6000);
      } else {
        const errorData = res.json();
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nastala chyba pri aktualizácii účinnej látky.",
        });
        throw new Error(errorData.message || "Error updating date");
      }
    });
  };

  const handleSubstanceSelectInsert = (event) => {
    console.log(event.ID_UCINNA_LATKA);
    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    fetch(`pharmacyManagers/insertUcinnaLatka`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        id_liek: detail.ID_LIEK,
        id_ucinna_latka: event.ID_UCINNA_LATKA,
      }),
    }).then((res) => {
      if (res.ok) {
        toast.current.show({
          severity: "success",
          summary: "Úspech",
          detail: "Účinná látka lieku bola priradená!",
        });
        setDisplayDialogForInsert(false);
        setTimeout(() => {
          redirect();
        }, 6000);
      } else {
        const errorData = res.json();
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nastala chyba pri priradení účinnej látky.",
        });
        throw new Error(errorData.message || "Error updating date");
      }
    });
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
      NAZOV: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  return (
    <div>
      {renderBackButton()}
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "45rem", height: "45rem" }}
          title=<h3>{detail.NAZOV_LIEKU}</h3>
        >
          {renderDetail("Typ lieku: ", detail.TYP)}
          {renderDetail("Dávkovanie lieku: ", detail.DAVKOVANIE)}
          {renderDetail("Množstvo: ", detail.MNOZSTVO)}
          {renderDetail("Účinná látka: ", detail.NAZOV_UCINNEJ_LATKY)}
          {renderDetail("Účinná látka (latinsky): ", detail.LATINSKY_NAZOV)}
          {renderCardFooter()}
        </Card>
      </div>
      <div className="col-12 flex"></div>
      {/* Dialog for displaying active substances */}
      <Dialog
        style={{ width: "90vh", height: "120vh" }}
        visible={displayDialogForUpdate}
        onHide={() => setDisplayDialogForUpdate(false)} // Close dialog when user clicks outside
        header={renderDialogHeader()}
      >
        <DataTable
          value={ucinneLatky}
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => handleSubstanceSelectUpdate(e.value)}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["NAZOV"]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="NAZOV" header="Názov účinnej látky"></Column>
        </DataTable>
      </Dialog>
      <Dialog
        style={{ width: "90vh", height: "120vh" }}
        visible={displayDialogForInsert}
        onHide={() => setDisplayDialogForInsert(false)} // Close dialog when user clicks outside
        header={renderDialogHeader()}
      >
        <DataTable
          value={ucinneLatky}
          selectionMode="single"
          selection={selectedRow}
          onSelectionChange={(e) => handleSubstanceSelectInsert(e.value)}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["NAZOV"]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="NAZOV" header="Názov účinnej látky"></Column>
        </DataTable>
      </Dialog>
      <Toast ref={toast} />
    </div>
  );
}
