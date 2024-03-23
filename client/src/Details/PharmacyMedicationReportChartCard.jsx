import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import GetUserData from "../Auth/GetUserData";

export default function PharmacyEmployeeReportChartCard(props) {
  const [info, setInfo] = useState(null); // Zmena z reťazca na null
  const [medicationDistribution, setMedicationDistribution] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };

    fetch(`pharmacyManagers/reportInfo/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        const reportData = data[0];
        setInfo(reportData);

        setMedicationDistribution({
          labels: ["Voľnopredajné", "Na predpis"],
          datasets: [
            {
              data: [
                reportData.POCET_LIEKOV_VOLNY,
                reportData.POCET_LIEKOV_PREDPIS,
              ],
              backgroundColor: ["#4BC0C0", "#9966FF"],
              hoverBackgroundColor: ["#4BC0C0", "#9966FF"],
            },
          ],
        });
      });
  }, []);

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  };

  return (
    <div>
      {info &&
        medicationDistribution && ( // Podmienené renderovanie
          <div className="flex col-12">
            <Card
              className="col-5 shadow-4 text-center"
              style={{ width: "40rem", height: "auto" }} // Upravená výška na auto
              title="Typy liekov"
            >
              <div className="card-body" style={{ display: "ruby-text" }}>
                <Chart
                  type="pie"
                  data={medicationDistribution}
                  options={options}
                  style={{ width: "60%", height: "60%" }}
                />
              </div>
            </Card>
          </div>
        )}
    </div>
  );
}
