import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useNavigate, useLocation } from "react-router";

export default function MedicamentCard(props) {
  const [detail, setDetail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `pharmacyManagers/detailLieku/${
        typeof props.medicamentId !== "undefined" && props.medicamentId !== null
          ? props.medicamentId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetail(...data);
      });
  }, []); //

  const redirect = () => {
    navigate("/medicaments");
  };

  const renderCardFooter = () => {
    return (
      <div>
        <Button
          label="Späť"
          icon="pi pi-replay"
          style={{ marginTop: 50 }}
          onClick={() => redirect()}
        />
      </div>
    );
  };

  const renderDetail = (label, value) => (
    <div className="flex w-100">
      <div className="col-6 m-0">
        <h3 className="ml-10">{label}</h3>
      </div>
      <div className="col-6 m-0">
        <h4 style={{ color: "gray" }}>{value}</h4>
      </div>
    </div>
  );

  return (
    <div>
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "45rem", height: "45rem" }}
          title=<h3>{detail.NAZOV_LIEKU}</h3>
        >
          {renderDetail("Typ lieku: ", detail.TYP)}
          {renderDetail("Dávkovanie lieku: ", detail.DAVKOVANIE)}
          {renderDetail("Množstvo: ", detail.MNOZSTVO)}
          {renderDetail(
            "Účinná látka: ",
            detail.ID_UCINNA_LATKA + ": " + detail.NAZOV_UCINNEJ_LATKY
          )}
          {renderDetail("Účinná látka (latinsky): ", detail.LATINSKY_NAZOV)}
          {renderCardFooter()}
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
