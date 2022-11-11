import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import mockDataJson from "../mock/mock-data.json";
function Patient() {
  const [mockData, setMockData] = useState([]);

  useEffect(
    () => {
      setMockData(mockDataJson.data);
    } /* eslint-disable react-hooks/exhaustive-deps */,
    []
  );

  return (
    <div>
      <div className="card">
        <DataTable
          value={mockData}
          responsiveLayout="scroll"
          selectionMode="single"
        >
          <Column field="code" header="Code" sortable></Column>
          <Column field="name" header="Name" sortable></Column>
          <Column field="category" header="Category" sortable></Column>
          <Column field="quantity" header="Quantity" sortable></Column>
          <Column field="price" header="Price" sortable></Column>
        </DataTable>
      </div>
    </div>
  );
}

export default Patient;
