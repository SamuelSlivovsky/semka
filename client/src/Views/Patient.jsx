import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import mockDataJson from "../mock/mock-data.json";
import { FilterMatchMode, FilterOperator } from "primereact/api";
function Patient() {
  const [mockData, setMockData] = useState([]);
  const [globalFilterValue1, setGlobalFilterValue1] = useState("");
  const [filters1, setFilters1] = useState(null);
  const renderHeader1 = () => {
    return (
      <div className="flex justify-content-between">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText
            value={globalFilterValue1}
            onChange={onGlobalFilterChange1}
            placeholder="Keyword Search"
          />
        </span>
      </div>
    );
  };

  const onGlobalFilterChange1 = (e) => {
    const value = e.target.value;
    let _filters1 = { ...filters1 };
    _filters1["global"].value = value;

    setFilters1(_filters1);
    setGlobalFilterValue1(value);
  };

  useEffect(() => {
    setMockData(mockDataJson.data);
    initFilters1();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters1 = () => {
    setFilters1({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      name: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      code: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      category: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
      quantity: {
        operator: FilterOperator.OR,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue1("");
  };

  const header1 = renderHeader1();
  return (
    <div>
      <div className="card">
        <DataTable
          value={mockData}
          responsiveLayout="scroll"
          selectionMode="single"
          header={header1}
          filters={filters1}
          filterDisplay="menu"
          globalFilterFields={["code", "name", "category", "quantity", "price"]}
          emptyMessage="No customers found."
        >
          <Column field="code" header="Code" sortable filter></Column>
          <Column field="name" header="Name" sortable filter></Column>
          <Column field="category" header="Category" sortable filter></Column>
          <Column field="quantity" header="Quantity" sortable filter></Column>
          <Column field="price" header="Price" sortable filter></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Patient;
