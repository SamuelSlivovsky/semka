import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { FilterMatchMode, FilterOperator } from "primereact/api";
import { useNavigate } from "react-router";
import { Tag } from "primereact/tag";
import GetUserData from "../../Auth/GetUserData";

export default function TabRooms() {
  const [globalFilterValue, setGlobalFilterValue] = useState("");
  const [filters, setFilters] = useState(null);
  const [rooms, setRooms] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    const userData = GetUserData(token);
    fetch(`lekar/miestnosti/${userData.UserInfo.userid}`, { headers })
      .then((res) => res.json())
      .then((data) => {
        setRooms(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (value) => {
    navigate("/room", { state: value.ID_MIESTNOSTI });
  };

  const renderHeader = () => {
    return (
      <div className="flex justify-content-between">
        <div className="table-header">
          Hľadaj
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
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    setGlobalFilterValue("");
  };

  const header = renderHeader();
  return (
    <div>
      <div className="card">
        <DataTable
          value={rooms}
          responsiveLayout="scroll"
          selectionMode="single"
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay="menu"
          globalFilterFields={["ID_MIESTNOSTI"]}
          emptyMessage="Žiadne výsledky nevyhovujú vyhľadávaniu"
        >
          <Column field="ID_MIESTNOSTI" header={"Miestnosť"}></Column>
          <Column field="KAPACITA" header={"Kapacita"}></Column>
        </DataTable>
      </div>
    </div>
  );
}
