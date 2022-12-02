import React, { useState, useRef } from "react";
import { Chart } from "primereact/chart";
import { InputNumber } from "primereact/inputnumber";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import "../styles/stat.css";
export default function Statistics() {
  const toast = useRef(null);
  const [render, setRender] = useState(false);
  const [muziZeny, setMuziZeny] = useState(null);
  const [pocetZam, setPocetZam] = useState(null);
  const [pocetPac, setPocetPac] = useState(null);
  const [pocetOpe, setPocetOpe] = useState(null);
  const [pocetHosp, setPocetHosp] = useState(null);
  const [pocetVys, setPocetVys] = useState(null);
  const [id, setId] = useState(null);
  const [year, setYear] = useState(null);
  const [pacientiVek, setPacientiVek] = useState(null);
  const [pacientiVekOptions, setPacientiVekOptions] = useState(null);
  const [sumaVyplat, setSumaVyplat] = useState(null);
  const [sumaVyplatOptions, setSumaVyplatOptions] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (id !== null && year !== null) {
      setRender(true);
      setLoading(true);
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

      fetch(`/selects/pocetZamOddelenia/${id}/${year}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetZam(result[0].POCET_ZAMESTNANCOV);
        });

      fetch(`/selects/pocetOperOddelenia/${id}/${year}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetOpe(result[0].POC_OPERACII);
        });

      fetch(`/selects/pocetHospitOddelenia/${id}/${year}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetHosp(result[0].POC_HOSPIT);
        });

      fetch(`/selects/pocetVyseOddelenia/${id}/${year}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetVys(result[0].POC_VYS);
        });

      fetch(`/selects/pocetPacOddelenia/${id}`)
        .then((res) => res.json())
        .then((result) => {
          setPocetPac(result[0].POCET_PACIENTOV);
        });

      fetch(`/selects/sumaVyplatRoka/${id}/${year}`)
        .then((res) => res.json())
        .then((result) => {
          console.log(result[0].JANUAR);
          setSumaVyplat({
            labels: [
              "Január",
              "Február",
              "Marec",
              "Apríl",
              "Máj",
              "Jún",
              "Júl",
              "August",
              "September",
              "Október",
              "November",
              "December",
            ],
            datasets: [
              {
                label: "Súčet výplat",
                backgroundColor: "#42A5F5",
                data: [
                  result[0].JANUAR,
                  result[0].FEBRUAR,
                  result[0].MAREC,
                  result[0].APRIL,
                  result[0].MAJ,
                  result[0].JUN,
                  result[0].JUL,
                  result[0].AUGUST,
                  result[0].SEPTEMBER,
                  result[0].OKTOBER,
                  result[0].NOVEMBER,
                  result[0].DECEMBER,
                ],
              },
            ],
          });
          setSumaVyplatOptions({
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
                  text: "Suma v €",
                },
              },
              x: {
                title: {
                  display: true,
                  text: "Mesiac",
                },
              },
            },
          });
        });

      fetch(`/selects/pocetPacientiPodlaVeku`)
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
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
                  text: "Počet",
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
    <div>
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
          <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
            Zadajte rok
          </label>
          <InputNumber
            inputId="withoutgrouping"
            value={year}
            onValueChange={(e) => setYear(e.value)}
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
        {render && !loading ? (
          <>
            <div className="xl:col-12">
              <div className="grid">
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
                  Počet pacientov
                  <p>{pocetPac}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
                  Počet zamestnancov
                  <p>{pocetZam}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
                  Počet vykonaných operácií
                  <p>{pocetOpe}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
                  Počet vykonaných hospitalizácií
                  <p>{pocetHosp}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-2xl count-card">
                  Počet vykonaných vysetrení
                  <p>{pocetVys}</p>
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
              <Chart
                type="bar"
                data={sumaVyplat}
                options={sumaVyplatOptions}
                style={{ width: "40%" }}
              />
            </div>
            <div className="xl:col-6 justify-content-center align-content-center flex h-auto">
              <Chart
                type="pie"
                data={muziZeny}
                style={{ position: "relative", width: "40%" }}
              />
            </div>{" "}
          </>
        ) : (
          ""
        )}
      </div>
      {loading ? (
        <ProgressBar
          mode="indeterminate"
          style={{ height: "6px", width: "99%" }}
        ></ProgressBar>
      ) : (
        ""
      )}
    </div>
  );
}
