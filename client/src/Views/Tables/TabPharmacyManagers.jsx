import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import GetUserData from "../../Auth/GetUserData";

export default function TabPharmacyManagers(props) {
    const [globalFilterValue, setGlobalFilterValue] = useState("");
    const [filters, setFilters] = useState(null);
    const [selectedRow, setSelectedRow] = useState(null);
    const [showDialog, setShowDialog] = useState(false);
    const [manazeriLekarni, setManazeriLekarni] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        const token = localStorage.getItem("hospit-user");
        const userDataHelper = GetUserData(token);
        const headers = { authorization: "Bearer " + token };
        fetch(`/pharmacyManager/manazeriLekarni/${userDataHelper.UserInfo.userid}`, { headers })
          .then((response) => response.json())
          .then((data) => {
console.log(data)
          });
      }, []);

    const onHide = () => {
        setSelectedRow(null);
        setShowDialog(false);
      };
    
      const onSubmit = () => {
        setShowDialog(false);
        navigate("/pharmacyManager", { state: selectedRow.CISLO_ZAM });
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
              Manažéri lekární
              <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                  value={globalFilterValue}
                  onChange={onGlobalFilterChange}
                  placeholder="Keyword Search"
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
        setManazeriLekarni(props.manazeriLekarni);
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
          LEKAREN_NAZOV: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
          },
          MESTO: {
            operator: FilterOperator.OR,
            constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
          },
        });
        setGlobalFilterValue("");
      };

      const header = renderHeader();
      return (
        <div>
          <div className="card">
            <DataTable
              value={manazeriLekarni}
              responsiveLayout="scroll"
              selectionMode="single"
              selection={selectedRow}
              onSelectionChange={(e) => handleClick(e.value)}
              header={header}
              filters={filters}
              filterDisplay="menu"
              globalFilterFields={[
                "LEKAREN_NAZOV",
                "MESTO",
                "MENO",
                "PRIEZVISKO",
                "MAIL",
              ]}
              emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
            >
              <Column field="LEKAREN_NAZOV" header={"Lekáreň"} filter></Column>
              <Column field="MESTO" header={"Mesto"} filter></Column>
              <Column field="MENO" header={"Meno"} filter></Column>
              <Column field="PRIEZVISKO" header={"Priezvisko"} filter></Column>
            </DataTable>
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
