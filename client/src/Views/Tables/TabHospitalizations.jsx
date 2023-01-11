import { useEffect, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";

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
      { field: "DATUM", header: "Dátum od - Dátum do" },
    ],
    filters: true,
  };

  return <div>{data && <TableMedicalRecords {...data} />}</div>;
}
