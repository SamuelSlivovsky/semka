import React, { useState } from "react";
import { Chart } from "primereact/chart";
import "../styles/stat.css";
export default function Statistics() {
  const [chartData] = useState({
    labels: ["A", "B", "C"],
    datasets: [
      {
        data: [300, 50, 100],
        backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
        hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
      },
    ],
  });

  const [basicData] = useState({
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "#42A5F5",
        data: [65, 59, 80, 81, 56, 55, 40],
      },
      {
        label: "My Second dataset",
        backgroundColor: "#FFA726",
        data: [28, 48, 40, 19, 86, 27, 90],
      },
    ],
  });

  const [lightOptions] = useState({
    plugins: {
      legend: {
        labels: {
          color: "#495057",
        },
      },
    },
  });
  return (
    <div className="grid">
      <div className="xl:col-12">
        <div className="grid">
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet pacientov
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet lekarov
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet vykonanych operacii
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet vykonanych hospitalizacii
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet vykonanych vysetreni
          </div>
        </div>
      </div>
      <div className="xl:col-12 justify-content-center align-content-center flex">
        <Chart
          type="bar"
          data={basicData}
          options={lightOptions}
          style={{ width: "40%" }}
        />
      </div>
      <div className="xl:col-6 justify-content-center align-content-center flex h-auto">
        <Chart
          type="pie"
          data={chartData}
          options={lightOptions}
          style={{ position: "relative", width: "40%" }}
        />
      </div>
      <div className="xl:col-6 justify-content-center align-content-center flex h-auto">
        <Chart
          type="pie"
          data={chartData}
          options={lightOptions}
          style={{ position: "relative", width: "40%" }}
        />
      </div>
    </div>
  );
}
