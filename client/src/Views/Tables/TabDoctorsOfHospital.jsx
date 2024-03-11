import React, { useState, useEffect } from "react";
import TabDoctors from "./TabDoctors";
import GetUserData from "../../Auth/GetUserData";
function TabDoctorsOfHospital() {
  const [lekari, setLekari] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/zamestnanci/${userDataHelper.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setLekari(<TabDoctors lekari={data} />);
      });
  }, []);

  return <div>{lekari}</div>;
}

export default TabDoctorsOfHospital;
