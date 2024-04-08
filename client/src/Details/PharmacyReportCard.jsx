import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
// import { Button } from "primereact/button";
import GetUserData from "../Auth/GetUserData";
// import { useNavigate } from "react-router";

export default function PharmacyReportCard(props) {
  const [info, setInfo] = useState("");
  // const navigate = useNavigate();
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);

    const headers = { authorization: "Bearer " + token };
    fetch(`pharmacyManagers/reportInfo/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setInfo(...data);
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
          title={info.NAZOV_LEKARNE}
        >
          <div className="card-body" style={{ marginBlock: "12%" }}>
            <div
              style={{
                borderRadius: "30px",
                outlineStyle: "solid",
                outlineColor: "#14b8a6",
              }}
            >
              {renderDetail(
                "Celkový počet zamestnancov: ",
                info.CELKOVY_POCET_ZAMESTNANCOV
              )}
            </div>
            <br />
            <div
              style={{
                borderRadius: "30px",
                outlineStyle: "solid",
                outlineColor: "#14b8a6",
              }}
            >
              {renderDetail(
                "Počet druhov liekov v lekárenskom sklade: ",
                info.POCET_LIEKOV
              )}
            </div>
            <br />
            <div
              style={{
                borderRadius: "30px",
                outlineStyle: "solid",
                outlineColor: "#14b8a6",
              }}
            >
              {renderDetail(
                "Počet druhov zdravotníckych pomôcok v lekárenskom sklade: ",
                info.POCET_ZDR_POMOCOK
              )}
            </div>
            <br />
            <div
              style={{
                borderRadius: "30px",
                outlineStyle: "solid",
                outlineColor: "#14b8a6",
              }}
            >
              {renderDetail(
                "Počet rezervácií lieku: ",
                info.POCET_REZERVACII_LIEKU
              )}
            </div>
            <br />
            <div
              style={{
                borderRadius: "30px",
                outlineStyle: "solid",
                outlineColor: "#14b8a6",
              }}
            >
              {renderDetail(
                "Počet rezervácií zdravotníckej pomôcky: ",
                info.POCET_REZERVACII_ZDR_POMOCKY
              )}
            </div>
          </div>
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
