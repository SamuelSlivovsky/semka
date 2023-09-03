import React, { useState, useEffect } from "react";
import TabDoctors from "./TabDoctors";
import GetUserData from "../../Auth/GetUserData";

function TabDoctorsOfPatient() {
  const [lekari, setLekari] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/patient/doctors/${userDataHelper.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setLekari(data);
      });
  }, []);
  return <div>{lekari && <TabDoctors lekari={lekari} />}</div>;
}

export default TabDoctorsOfPatient;
