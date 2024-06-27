import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import GetUserData from "../Auth/GetUserData";

export default function PharmacistCard(props) {
  const [profile, setProfile] = useState("");
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);

    const headers = { authorization: "Bearer " + token };
    fetch(`pharmacyManagers/pouzivatelInfo/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setProfile(...data);
        console.log(data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const renderDetail = (label, value) => (
    <div className="flex w-100">
      <div className="col-6">
        <h3>{label}</h3>
      </div>
      <div className="col-6">
        <h3 style={{ color: "gray", fontWeight: "600", fontStyle: "italic" }}>
          {value}
        </h3>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "45rem", height: "55rem" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          {renderDetail("Rodné číslo: ", profile.ROD_CISLO)}
          {renderDetail(
            "Adresa bydliska: ",
            profile.ULICA + ", " + profile.PSC + " " + profile.NAZOV_MESTA
          )}
          {renderDetail("Okres: ", profile.NAZOV_OKRESU)}
          {renderDetail("Kraj: ", profile.NAZOV_KRAJA)}
          {renderDetail("Mobil: ", profile.TELEFON)}
          {renderDetail("E - mail: ", profile.EMAIL)}
          {renderDetail(
            "Rola zamestnanca: ",
            profile.ID_TYP + ": " + profile.NAZOV_ROLE
          )}
          {renderDetail("Číslo zamestnanca: ", profile.CISLO_ZAM)}
          {renderDetail("Zamestnanec od: ", profile.DAT_OD)}
          {renderDetail("Pracovisko (lekáreň): ", profile.NAZOV_LEKARNE)}
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
