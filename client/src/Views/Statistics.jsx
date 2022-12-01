import React, { useState, useRef } from "react";
import { Chart } from "primereact/chart";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../styles/stat.css";
export default function Statistics() {
  const toast = useRef(null);
  const [muziZeny, setMuziZeny] = useState(null);
  const [pocetZam, setPocetZam] = useState(null);
  const [pocetPac, setPocetPac] = useState(null);
  const [id, setId] = useState(null);
  const [pacientiVek, setPacientiVek] = useState(null);
  const [pacientiVekOptions, setPacientiVekOptions] = useState(null);

  const handleSubmit = () => {
    if (id !== null) {
      fetch(`/selects/pomerMuziZeny`)
        .then((res) => res.json())
        .then((result) => {
          setMuziZeny({
            labels: ["Muzi", "Zeny"],
            datasets: [
              {
                data: [result[0].MUZI, result[0].ZENY],
                backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
              },
            ],
          });
        });

      fetch(`/selects/priemernyVek`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result);
        });
      fetch(`/selects/pocetZamOddelenia/${id}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetZam(result[0].POCET_ZAMESTNANCOV);
        });
      fetch(`/selects/pocetPacOddelenia/${id}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetPac(result[0].POCET_PACIENTOV);
        });

      fetch(`/selects/pocetPacientiPodlaVeku`)
        .then((res) => res.json())
        .then((result) => {
          setPacientiVek({
            labels: result.map((item) => item.VEK),
            datasets: [
              {
                label: "Pacienti",
                backgroundColor: "#42A5F5",
                data: result.map((item) => item.POCET),
              },
            ],
          });
          setPacientiVekOptions({
            plugins: {
              legend: {
                labels: {
                  color: "#495057",
                },
              },
            },
            scales: {
              y: {
                title: {
                  display: true,
                  text: "Pocet",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Vek",
                },
              },
            },
          });
        });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Zadajte ID oddelenia",
        life: 3000,
      });
    }
  };

  return (
    <div className="grid" style={{ marginTop: "1rem" }}>
      <Toast ref={toast} />
      <div className="field col-4 md:col-3">
        <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
          Zadajte id
        </label>
        <InputNumber
          autoFocus
          inputId="withoutgrouping"
          value={id}
          onValueChange={(e) => setId(e.value)}
          mode="decimal"
          useGrouping={false}
        />
      </div>
      <div className="field col-4 md:col-3">
        <Button
          icon="pi pi-check"
          label="Zadaj"
          onClick={handleSubmit}
        ></Button>
      </div>
      <div className="xl:col-12">
        <div className="grid">
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet pacientov
            <p>{pocetPac}</p>
          </div>
          <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
            Pocet zamestnancov
            <p>{pocetZam}</p>
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
          data={pacientiVek}
          options={pacientiVekOptions}
          style={{ width: "40%" }}
        />
      </div>
      <div className="xl:col-6 justify-content-center align-content-center flex h-auto">
        <Chart
          type="pie"
          data={muziZeny}
          style={{ position: "relative", width: "40%" }}
        />
      </div>
    </div>
  );
}
