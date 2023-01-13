import { useEffect, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";
import GetUserData from "../../Auth/GetUserData";

export default function TabExaminations() {
  const [vysetrenia, setVysetrenia] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/vysetrenia/${userDataHelper.UserInfo.userid}`, { headers })
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
    allowFilters: true,
    dialog: true,
  };

  return <div>{data && <TableMedicalRecords {...data} />}</div>;
}
