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
import { ProgressSpinner } from "primereact/progressspinner";
import { Dropdown } from "primereact/dropdown";

export default function TabPharmacists() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [loading, setLoading] = useState(true);
  const [lekarnici, setLekarnici] = useState([]);
  const navigate = useNavigate();
  const [nazovLekarne, setNazovLekarne] = useState([]);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPharmacist, setNewPharmacist] = useState({
    /* initial form data state */
  });
  // Assume cities/PSC codes are fetched and stored in the following state:
  const [cities, setCities] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
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
          console.log(data);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
            <h2>Zoznam lekárnikov pracujúcich v lekárni: </h2>
            <h3>{nazovLekarne}</h3>
          </div>
        </div>
        <Button
          style={{ height: "50px" }}
          label="Pridať lekárnika"
          icon="pi pi-plus"
          onClick={() => setShowAddDialog(true)}
        />
      </div>
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
        <div className="p-field">
          <label htmlFor="rodneCislo">Rodné číslo (s lomkou)</label>
          <InputText
            id="rodneCislo"
            value={newPharmacist.rodneCislo}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, rodneCislo: e.target.value })
            }
          />
        </div>
        <div className="p-field">
          <label htmlFor="meno">Meno</label>
          <InputText
            id="meno"
            value={newPharmacist.meno}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, meno: e.target.value })
            }
          />
        </div>
        <div className="p-field">
          <label htmlFor="priezvisko">Priezvisko</label>
          <InputText
            id="priezvisko"
            value={newPharmacist.priezvisko}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, priezvisko: e.target.value })
            }
          />
        </div>
        <div className="p-field">
          <label htmlFor="city">Mesto</label>
          <Dropdown
            id="city"
            value={newPharmacist.city}
            options={cities}
            onChange={(e) =>
              setNewPharmacist({ ...newPharmacist, city: e.value })
            }
            optionLabel="name" // Assuming your city objects have a 'name' property
            placeholder="Vyberte mesto"
          />
        </div>
        <Button
          style={{ marginTop: "50px" }}
          label="Pridať"
          icon="pi pi-check"
          onClick={() => {
            /* Handle form submission here */
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
          onClick={() => deletePharmacist(rowData)}
        />
      </React.Fragment>
    );
  };

  // Add these functions to handle edit and delete actions
  const editPharmacist = (pharmacist) => {
    // Implementation for editing pharmacist
  };

  const deletePharmacist = (pharmacist) => {
    // Implementation for deleting pharmacist
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
