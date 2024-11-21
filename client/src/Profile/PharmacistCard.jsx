import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router";

export default function PharmacistCard(props) {
  const [profile, setProfile] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `pharmacyManagers/lekarnikInfo/${
        typeof props.pharmacistId !== "undefined" && props.pharmacistId !== null
          ? props.pharmacistId
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
    navigate("/pharmacists");
  };

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na zoznam lekárnikov"
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
          style={{ width: "45rem", height: "45rem" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          {renderDetail("ID lekárnika: ", profile.CISLO_ZAM)}
          {renderDetail("Rodné číslo: ", profile.ROD_CISLO)}
          {renderDetail("Dátum narodenia: ", profile.DATUM_NARODENIA)}
          {renderDetail("Vek: ", profile.VEK)}
          {renderDetail(
            "Adresa bydliska: ",
            profile.NAZOV_OBCE + " " + profile.PSC
          )}
          {renderDetail("Mobil: ", profile.TELEFON)}
          {renderDetail("E - mail: ", profile.EMAIL)}
          <div className="mt-5 text-center">
            <Button label="Poslať správu" icon="pi pi-send" />
          </div>
        </Card>

        <Card
          className="col-4 shadow-4"
          title="Predpísané recepty"
          style={{ width: "45rem", height: "45rem" }}
        ></Card>
      </div>

      <div className="col-12 flex">
        <Card
          className="col-5 shadow-4"
          title="Zdravotné záznamy"
          style={{ width: "45rem", height: "45rem" }}
        ></Card>
        <Card
          className="col-5 shadow-4"
          title="Choroby"
          style={{ width: "45rem", height: "45rem" }}
        ></Card>
      </div>
    </div>
  );
}
