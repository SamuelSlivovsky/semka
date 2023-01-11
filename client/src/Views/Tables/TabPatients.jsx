import TableWithDetail from "./TableWithDetail";
import { useState } from "react";
import { useEffect } from "react";

export default function TabPatients() {
  const [pacienti, setPacienti] = useState([]);

  useEffect(() => {
    fetch(`/lekar/pacienti/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setPacienti(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tableData = {
    tableName: "Pacienti",
    route: "/patient",
    cellData: pacienti,
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
      { field: "PSC", header: "Psc" },
    ],
  };

  return (
    <div>
      <TableWithDetail {...tableData} />
    </div>
  );
}
