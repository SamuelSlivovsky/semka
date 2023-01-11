import TableWithoutDetail from "./TableWithoutDetail";
import { useState } from "react";
import { useEffect } from "react";

export default function TabDoctros() {
  const [lekari, setLekari] = useState([]);

  useEffect(() => {
    fetch(`/lekar/lekari/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLekari(data);
      });
  }, []);

  const tableData = {
    tableName: "Doktori",
    route: "/lekar",
    cellData: lekari,
    titles: [
      { field: "ODDELENIE_NAZOV", header: "Oddelenie" },
      { field: "NEMOCNICA_NAZOV", header: "Nemocnica" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
    ],
  };

  return (
    <div>
      <TableWithoutDetail {...tableData} />
    </div>
  );
}
