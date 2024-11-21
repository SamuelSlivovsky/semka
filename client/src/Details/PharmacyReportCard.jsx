import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import GetUserData from "../Auth/GetUserData";

export default function PharmacyReportCard(props) {
  const [info, setInfo] = useState("");
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

  const renderDetail = (label, value, icon, color) => (
    <div className="flex align-items-center justify-content-between p-3 border-1 border-50 border-round surface-0 shadow-2 mb-3">
      <span
        style={{ fontSize: "18px" }}
        className="block text-700 font-medium mb-4"
      >
        {label}
      </span>
      <div className="flex align-items-center">
        <i className={`pi ${icon} text-${color}-500 text-xl mr-3`}></i>
        <div className="text-900 font-medium text-xl">{value}</div>
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
          <div className="card-body" style={{ marginBlock: "20%" }}>
            {renderDetail(
              "Celkový počet zamestnancov v lekárni",
              info.CELKOVY_POCET_ZAMESTNANCOV,
              "pi-users",
              "blue"
            )}
            {renderDetail(
              "Počet druhov liekov v lekárenskom sklade",
              info.POCET_LIEKOV,
              "pi-align-justify",
              "green"
            )}
            {renderDetail(
              "Počet druhov zdravotníckych pomôcok v lekárenskom sklade",
              info.POCET_ZDR_POMOCOK,
              "pi-align-justify",
              "green"
            )}
            {renderDetail(
              "Počet rezervácií lieku v lekárni",
              info.POCET_REZERVACII_LIEKU,
              "pi-calendar-plus",
              "yellow"
            )}
            {renderDetail(
              "Počet rezervácií zdravotníckej pomôcky v lekárni",
              info.POCET_REZERVACII_ZDR_POMOCKY,
              "pi-calendar-plus",
              "yellow"
            )}
          </div>
        </Card>
      </div>
      <div className="col-12 flex"></div>
    </div>
  );
}
