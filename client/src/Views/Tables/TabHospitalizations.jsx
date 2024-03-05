import { useEffect, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";
import GetUserData from "../../Auth/GetUserData";

export default function TabHospitalizations() {
  const [hospitalizacie, setHospitalizacie] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    await fetch(`/lekar/hospitalizacie/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setHospitalizacie(data);
        setLoading(false);
      });
  };

  const data = {
    tableName: "Hospitalizácie",
    cellData: hospitalizacie,
    fetchData: () => fetchData(),
    titles: [
      { field: "ROD_CISLO", header: "Rodné číslo" },
      { field: "MENO", header: "Meno" },
      { field: "PRIEZVISKO", header: "Priezvisko" },
      { field: "DATUM", header: "Dátum od - Dátum do" },
    ],
    allowFilters: true,
    dialog: true,
    eventType: "Hospitalizácia",
    tableLoading: loading,
  };

  return <div>{data && <TableMedicalRecords {...data} />}</div>;
}
