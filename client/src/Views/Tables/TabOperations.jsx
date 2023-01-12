import { useEffect, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";

export default function TabOperations() {
  const [operacie, setOperacie] = useState(null);

  useEffect(() => {
    fetch(`/lekar/operacie/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOperacie(data);
      });
  }, []);

  console.log(operacie);
  const data = {
    tableName: "Operácie",
    cellData: operacie,
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
      { field: "DATUM", header: "Dátum" },
    ],
    allowFilters: true,
    dialog: true,
  };

  return <div>{data && <TableMedicalRecords {...data} />}</div>;
}
