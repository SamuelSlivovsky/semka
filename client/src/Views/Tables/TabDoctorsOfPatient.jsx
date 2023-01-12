import React, { useState, useEffect } from "react";
import TabDoctors from "./TabDoctors";

function TabDoctorsOfPatient() {
  const [lekari, setLekari] = useState([]);

  useEffect(() => {
    fetch(`/patient/doctors/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLekari(data);
      });
  }, []);
  return <div>{lekari && <TabDoctors lekari={lekari} />}</div>;
}

export default TabDoctorsOfPatient;
