import React, { useState, useEffect } from "react";
import TabDoctors from "./TabDoctors";

function TabDoctorsOfHospital() {
  const [lekari, setLekari] = useState(null);

  useEffect(() => {
    fetch(`/lekar/lekari/${2}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setLekari(data);
      });
  }, []);

  return <div>{lekari && <TabDoctors lekari={lekari} />}</div>;
}

export default TabDoctorsOfHospital;
