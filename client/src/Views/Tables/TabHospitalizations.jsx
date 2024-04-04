import { useEffect, useRef, useState } from "react";
import TableMedicalRecords from "./TableMedicalRecords";
import GetUserData from "../../Auth/GetUserData";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";

export default function TabHospitalizations() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [hospitalizacie, setHospitalizacie] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/hospitalizacie/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (response.status === 410) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: "error",
            summary: "Session timeout redirecting to login page",
            life: 999999999,
          });
          setTimeout(() => {
            navigate("/logout");
          }, 3000);
        }
      })
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

  return (
    <div>
      <Toast ref={toast} position="top-center" />
      {data && <TableMedicalRecords {...data} />}
    </div>
  );
}
