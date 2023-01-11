import { useEffect, useState } from "react";
import TableWithoutDetail from "./TableWithoutDetail";

export default function TabHospitalizations() {
  const [hospitalizacie, setHospitalizacie] = useState([]);

  useEffect(() => {
    fetch(`/lekar/hospitalizacie/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHospitalizacie(data);
      });
  }, []);

  const data = {
    tableName: "Hospitalizácie",
    cellData: hospitalizacie,
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
      { field: "DAT_OD", header: "Dátum prijatia" },
      { field: "DAT_DO", header: "Dátum prepustenia" },
    ],
    filters: true,
  };

  return (
    <div>
      <TableWithoutDetail {...data} />
    </div>
  );
}
