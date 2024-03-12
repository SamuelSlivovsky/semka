import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import GetUserData from "../Auth/GetUserData";
import { useNavigate } from "react-router";

export default function PharmacistCard(props) {
  const [profile, setProfile] = useState("");
  const navigate = useNavigate();
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

  const redirect = () => {
    navigate("/");
  };

  const renderCardFooter = () => {
    return (
      <div>
        <Button
          label="Späť"
          icon="pi pi-replay"
          style={{ marginTop: "75px" }}
          onClick={() => redirect()}
        />
      </div>
    );
  };

  const renderDetail = (label, value) => (
    <div className="flex w-100">
      <div className="col-6">
        <h3>{label}</h3>
      </div>
      <div className="col-6">
        <h4 style={{ color: "gray" }}>{value}</h4>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "40rem", height: "55rem" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          {renderDetail("Rodné číslo: ", profile.ROD_CISLO)}
          {renderDetail(
            "Adresa bydliska: ",
            profile.ULICA + ", " + profile.PSC + " " + profile.NAZOV_MESTA
          )}
          {renderDetail("Okres: ", profile.NAZOV_OKRESU)}
          {renderDetail("Kraj: ", profile.NAZOV_KRAJA)}
          {renderDetail(
            "Rola zamestnanca: ",
            profile.ID_TYP + ": " + profile.NAZOV_ROLE
          )}
          {renderDetail("Číslo zamestnanca: ", profile.CISLO_ZAM)}
          {renderDetail("Zamestnanec od: ", profile.DAT_OD)}
          {renderDetail("Pracovisko (lekáreň): ", profile.NAZOV_LEKARNE)}
          {renderCardFooter()}
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
