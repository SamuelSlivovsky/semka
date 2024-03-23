import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router";

export default function LaborantCard(props) {
  const [profile, setProfile] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `pharmacyManagers/laborantInfo/${
        typeof props.laborantId !== "undefined" && props.laborantId !== null
          ? props.laborantId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setProfile(...data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const redirect = () => {
    navigate("/laborants");
  };

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na zoznam laborantov"
          icon="pi pi-replay"
          style={{ marginTop: "10px", marginLeft: "10px" }}
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
      {renderBackButton()}
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "40rem", height: "40rem" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          {renderDetail("ID lekárnika: ", profile.CISLO_ZAM)}
          {renderDetail("Rodné číslo: ", profile.ROD_CISLO)}
          {renderDetail("Rok narodenia: ", profile.DATUM_NARODENIA)}
          {renderDetail("Vek: ", profile.VEK)}
          {renderDetail(
            "Adresa bydliska: ",
            profile.NAZOV_OBCE + " " + profile.PSC
          )}

          <div className="mt-5 text-center">
            <Button label="Poslať správu" icon="pi pi-send" />
          </div>
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
