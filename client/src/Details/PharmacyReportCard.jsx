import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import GetUserData from "../Auth/GetUserData";
import { useNavigate } from "react-router";

export default function PharmacyReportCard(props) {
  const [info, setInfo] = useState("");
  const navigate = useNavigate();
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

  //   const redirect = () => {
  //     navigate("/");
  //   };

  //   const renderCardFooter = () => {
  //     return (
  //       <div>
  //         <Button
  //           label="Späť"
  //           icon="pi pi-replay"
  //           style={{ marginTop: 0 }}
  //           onClick={() => redirect()}
  //         />
  //       </div>
  //     );
  //   };

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
          style={{ width: "40rem", height: "50rem" }}
          title={info.NAZOV_LEKARNE}
        >
          {renderDetail("Počet zamestnancov: ", info.POCET_ZAMESNTNACOV)}
          {renderDetail(
            "Počet liekov v lekárenskom sklade: ",
            info.POCET_LIEKOV_V_LEK_SKLADE
          )}
          {renderDetail(
            "Počet zdravotníckych pomôcok v lekárenskom sklade: ",
            info.POCET_ZDR_POMOCOK_V_LEK_SKLADE
          )}
          {/* {renderCardFooter()} */}
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
