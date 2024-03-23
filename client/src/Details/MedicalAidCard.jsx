import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { useNavigate, useLocation } from "react-router";
import { Button } from "primereact/button";

export default function MedicalAidCard(props) {
  const [detail, setDetail] = useState("");
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `pharmacyManagers/detailZdravotnickejPomocky/${
        typeof props.medicalAidId !== "undefined" && props.medicalAidId !== null
          ? props.medicalAidId
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
    navigate("/medical_aids");
  };

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na číselník zdr. pomôcok"
          icon="pi pi-replay"
          style={{ marginTop: "10px", marginLeft: "10px" }}
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
      {renderBackButton()}
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "40rem", height: "40rem" }}
          title=<h3>{detail.NAZOV}</h3>
        >
          {renderDetail(
            "Doplnok k zdravotníckej pomôcke: ",
            detail.DOPLNOK_NAZVU
          )}
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
