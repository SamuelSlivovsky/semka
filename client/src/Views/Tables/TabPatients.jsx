import TablePeople from "./TablePeople";
import { useState } from "react";
import { useEffect } from "react";

export default function TabPatients() {
  const [mockData, setMockData] = useState([]);

  useEffect(() => {
    fetch(`/lekar/pacienti/${2}`)
      .then((response) => response.json())
      .then((data) => {
        setMockData(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const tableData = {
    tableName: "Pacienti",
    route: "/patient",
    cellData: mockData,
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
    ],
  };

  return (
    <div>
      <TablePeople {...tableData} />
    </div>
  );
}
