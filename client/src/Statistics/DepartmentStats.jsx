import React from "react";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
function DepartmentStats(props) {
  const {
    pocetPac,
    pocetZam,
    pocetOpe,
    pocetHosp,
    pocetVys,
    pacientiVek,
    pacientiVekOptions,
    muziZeny,
    krv,
    departmentEvents,
  } = props;
  return (
    <div>
      {" "}
      <div className="xl:col-12">
        <div className="grid">
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet pacientov
            <p>{pocetPac}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet zamestnancov
            <p>{pocetZam}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet vykonaných operácií
            <p>{pocetOpe}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet vykonaných hospitalizácií
            <p>{pocetHosp}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
            Počet vykonaných vyšetrení
            <p>{pocetVys}</p>
          </div>
        </div>
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <Chart
          type="bar"
          data={pacientiVek}
          options={pacientiVekOptions}
          style={{ width: "50%" }}
        />
        <DataTable
          value={departmentEvents}
          style={{ width: "49%" }}
          scrollHeight="400px"
        >
          <Column field="MENO" header="Zamestnanec" />
          <Column field="POCETOPE" header="Počet operácíí" />
          <Column field="POCETVYS" header="Počet vyšetrení" />
        </DataTable>
      </div>
      <div className="xl:col-12 justify-content-center align-content-center flex h-auto">
        <Chart
          type="pie"
          data={muziZeny}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Podiel pohlaví pacientov (%)",
              },
            },
          }}
          style={{ position: "relative", width: "30%" }}
        />
        <Chart
          type="pie"
          options={{
            plugins: {
              title: {
                display: true,
                text: "Podiel typu krvi u pacientov",
              },
            },
          }}
          data={krv}
          style={{ position: "relative", width: "30%" }}
        />
      </div>{" "}
    </div>
  );
}

export default DepartmentStats;
