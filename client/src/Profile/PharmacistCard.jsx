import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useLocation } from "react-router";

export default function PharmacistCard(props) {
    const [profile, setProfile] = useState("");
    const location = useLocation();
  
    useEffect(() => {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      fetch(
        `pharmacyManagers/lekarnikInfo/${
          typeof props.doctorId !== "undefined" && props.doctorId !== null
            ? props.doctorId
            : location.state
        }`,
        { headers }
      )
        .then((response) => response.json())
        .then((data) => {
          setProfile(...data);
        });
    }, []); // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
      <div>
        <div className="flex col-12 ">
          <Card
            className="col-5 shadow-4 text-center"
            style={{ width: "40rem", height: "30rem" }}
            title={profile.MENO + " " + profile.PRIEZVISKO}
          >
            <div className="flex ">
              <div className="col-12 text-center m-0">
                <h4>Rok narodenia</h4>
                <div>{profile.DATUM_NARODENIA}</div>
              </div>
            </div>
  
            <div className="flex w-100">
              <div className="col-12 text-center m-0">
                <h4>Vek</h4>
                <div>{profile.VEK}</div>
              </div>
            </div>
  
            <div className="flex w-100">
              <div className="col-12 text-center m-0">
                <h4>Adresa</h4>
                <div>{profile.NAZOV_OBCE + " " + profile.PSC}</div>
              </div>
            </div>
            <div className="mt-5 text-center">
              <Button label="Poslať správu" icon="pi pi-send" />
            </div>
          </Card>
        </div>
        <div className="col-12 flex">
        </div>
      </div>
    );
  }