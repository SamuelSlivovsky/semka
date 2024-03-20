import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Chart } from "primereact/chart";
import GetUserData from "../Auth/GetUserData";
import { useNavigate } from "react-router";

export default function PharmacyReportCard(props) {
  const [info, setInfo] = useState("");
  // Example data for charts - replace with your actual data
  const [employeeDistribution, setEmployeeDistribution] = useState({});
  const [medicationDistribution, setMedicationDistribution] = useState({});

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);

    const headers = { authorization: "Bearer " + token };
    fetch(`pharmacyManagers/reportInfo/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setInfo(data);
        console.log(data);
        // Assuming data contains the fields you need
        setEmployeeDistribution({
          labels: ["Managers", "Pharmacists", "Lab Technicians"],
          datasets: [
            {
              data: [
                data.POCET_MANAZEROV,
                data.POCET_LEKARNIKOV,
                data.POCET_LABORANTOV,
              ],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
              hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
            },
          ],
        });

        setMedicationDistribution({
          labels: ["Over-the-Counter", "Prescription"],
          datasets: [
            {
              data: [data.POCET_LIEKOV_VOLNY, data.POCET_LIEKOV_PREDPIS],
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
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "40rem", height: "55rem" }} // Adjust height based on content
          title={info.NAZOV_LEKARNE}
        >
          {/* Existing code */}
          <Chart
            type="pie"
            data={employeeDistribution}
            options={options}
            style={{ marginBottom: "20px" }}
          />
          <Chart type="pie" data={medicationDistribution} options={options} />
          {/* Continue with your existing layout */}
        </Card>
      </div>
    </div>
  );
}
