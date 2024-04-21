import React, {useState, useEffect, useRef} from "react";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import {Dialog} from "primereact/dialog";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode, FilterOperator} from "primereact/api";
import {useNavigate} from "react-router";
import { Tag } from "primereact/tag";
import GetUserData from "../../Auth/GetUserData";
import { Toast } from "primereact/toast";
import { InputMask } from "primereact/inputmask";

export default function TabPatients() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [patientId, setPatientId] = useState(null);
  const toast = useRef(null);
  const [pacienti, setPacienti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
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
        setPacienti(data);
      });
  }, []);

  const handleClick = (value) => {
    navigate("/patient", { state: value.ID_PACIENTA });
  };

  const findPatient = () => {
    if (patientId.length == 11) {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      const userDataHelper = GetUserData(token);
      fetch(
        `/lekar/pacient/${patientId.replace("/", "$")}/${
          userDataHelper.UserInfo.userid
        }`,
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
          if (data && data.ID_PACIENTA != null) {
            navigate("/patient", { state: data.ID_PACIENTA });
          } else {
            toast.current.show({
              severity: "error",
              summary: "Neplatné rodné číslo",
              life: 3000,
            });
          }
        });
    }
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          Pacienti
          <span className="p-input-icon-left" style={{ marginLeft: "10px" }}>
            <i className="pi pi-search" />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
            />
          </span>
        </div>
        <div className="table-header">
          Vyhľadať pacienta
          <span className="p-input-icon-left" style={{ marginLeft: "10px" }}>
            <i className="pi pi-search" />
            <InputText
              value={patientId}
              onKeyDown={(e) => {
                if (e.code === "Enter") findPatient();
              }}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder="Rodné číslo"
            />
          </span>
        </div>
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
      PSC: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ID_POISTENCA: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue("");
  };

  const statusBodyTemplate = (rowData) => {
    return (
      <Tag
        style={{ width: "110px" }}
        severity={rowData.JE_HOSPIT ? "success" : "info"}
        value={rowData.JE_HOSPIT == 1 ? "Hospitalizovaný" : "Iné"}
      />
    );
  };

  const header = renderHeader();
  return (
    <div>
      <Toast ref={toast} position="top-center" />
      <div className="card">
        <DataTable
          value={pacienti}
          responsiveLayout="scroll"
          selectionMode="single"
          paginator
          rows={15}
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={[
            "ROD_CISLO",
            "MENO",
            "PRIEZVISKO",
            "PSC",
            "ID_POISTENCA",
          ]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="ROD_CISLO" header={"Rodné číslo"}></Column>
          <Column field="MENO" header={"Meno"}></Column>
          <Column field="PRIEZVISKO" header={"Priezvisko"}></Column>
          <Column field="PSC" header={"PSČ"}></Column>
          <Column field="ID_POISTENCA" header={"Číslo poistenca"}></Column>
          <Column field="NAZOV" header={"Poisťovňa"}></Column>
          <Column
            body={statusBodyTemplate}
            header={"Status"}
            field="JE_HOSPIT"
            sortable
          ></Column>
        </DataTable>
      </div>
    </div>
  );
}
