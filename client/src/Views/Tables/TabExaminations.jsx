import { useEffect, useState } from "react";
import TableWithoutDetail from "./TableWithoutDetail";

export default function TabExaminations() {
  const [vysetrenia, setVysetrenia] = useState([]);

  useEffect(() => {
    fetch(`/lekar/vysetrenia/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setVysetrenia(data);
      });
  }, []);

  const data = {
    tableName: "Vyšetrenia",
    cellData: vysetrenia,
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
      { field: "DATUM", header: "Dátum" },
    ],
  };

  return (
    <div>
      <TableWithoutDetail {...data} />
    </div>
  );
}
