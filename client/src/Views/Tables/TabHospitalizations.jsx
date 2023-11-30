import { useEffect, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";
import GetUserData from "../../Auth/GetUserData";

export default function TabHospitalizations() {
  const [hospitalizacie, setHospitalizacie] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/hospitalizacie/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
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
    allowFilters: true,
    dialog: true,
    eventType: "Hospitalizácia",
  };

  return <div>{data && <TableMedicalRecords {...data} />}</div>;
}
