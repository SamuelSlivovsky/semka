import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import React from "react";
function DoctorStats(props) {
  const { pocetOpe, pocetVys, recipes } = props;
  const dateBodyTemplate = (rowData) => {
    return (
      <span>
        {new Date(rowData.DATUM_ZAPISU).toLocaleString("de-DE", {
          dateStyle: "medium",
        })}
      </span>
    );
  };
  return (
    <div>
      {" "}
      <div className="xl:col-12">
        <div className="grid">
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet vykonaných operácií
            <p>{pocetOpe}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet vykonaných vyšetrení
            <p>{pocetVys}</p>
          </div>
        </div>
      </div>
      <div>
        <DataTable value={recipes}>
          <Column body={dateBodyTemplate} header="Dátum zápisu" />
          <Column field="NAZOV" header="Liek" />
        </DataTable>
      </div>
    </div>
  );
}

export default DoctorStats;
