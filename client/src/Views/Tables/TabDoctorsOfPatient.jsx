import React, { useState,useRef, useEffect } from "react";
import TabDoctors from "./TabDoctors";
import GetUserData from "../../Auth/GetUserData";
import {useNavigate} from "react-router";
import {Toast} from "primereact/toast";

function TabDoctorsOfPatient() {
  const [lekari, setLekari] = useState([]);
  const toast = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/patient/doctors/${userDataHelper.UserInfo.userid}`, { headers })
        .then((response) => {
          // Kontrola ci response je ok (status:200)
          if (response.ok) {
            return response.json();
            // Kontrola ci je token expirovany (status:410)
          } else if (response.status === 410) {
            // Token expiroval redirect na logout
            toast.current.show({
              severity: 'error',
              summary: "Session timeout redirecting to login page",
              life: 999999999
            });
            setTimeout(() => {
              navigate("/logout")
            }, 3000)
          }
        })
      .then((data) => {
        setLekari(data);
      });
  }, []);
  return <div><Toast ref={toast} position="top-center"/>
    {lekari && <TabDoctors lekari={lekari} />}</div>;
}

export default TabDoctorsOfPatient;
