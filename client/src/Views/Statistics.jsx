import React, { useState, useRef, useEffect } from "react";
import { Chart } from "primereact/chart";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { ProgressBar } from "primereact/progressbar";
import { Calendar } from "primereact/calendar";
import { addLocale } from "primereact/api";
import { Checkbox } from "primereact/checkbox";
import { Dropdown } from "primereact/dropdown";
import GetUserData from "../Auth/GetUserData.jsx";
import sk from "../locales/sk.json";

import "../styles/stat.css";
export default function Statistics() {
  const toast = useRef(null);
  const [render, setRender] = useState(false);
  const [muziZeny, setMuziZeny] = useState(null);
  const [wholeYearCheck, setWholeYearCheck] = useState(false);
  const [pocetZam, setPocetZam] = useState(null);
  const [pocetPac, setPocetPac] = useState(null);
  const [pocetOpe, setPocetOpe] = useState(null);
  const [pocetHosp, setPocetHosp] = useState(null);
  const [pocetVys, setPocetVys] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [krv, setKrv] = useState(null);
  const [date, setDate] = useState("");
  const [pacientiVek, setPacientiVek] = useState(null);
  const [pacientiVekOptions, setPacientiVekOptions] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userId = GetUserData(token).UserInfo.userid;
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/oddeleniePrimara/${userId}`, { headers })
      .then((res) => res.json())
      .then((result) => {
        setDepartment(result);
      });

    fetch(`/lekar/lekari/${userId}`, { headers })
      .then((res) => res.json())
      .then((result) => {
        result = result.map((item) => {
          return { ...item, name: `${item.MENO} ${item.PRIEZVISKO}` };
        });
        setSelectedDoctor(result.find((item) => item.CISLO_ZAM == userId));
        setDoctors(result);
      });
    addLocale("sk", sk);
  }, []);

  const handleSubmit = () => {
    const token = localStorage.getItem("hospit-user");
    const userId = GetUserData(token).UserInfo.userid;
    const headers = { authorization: "Bearer " + token };
    if (date !== null && selectedDoctor !== null) {
      setRender(true);
      setLoading(true);
      const dateParam = wholeYearCheck
        ? date.getFullYear()
        : `${date.getFullYear()}&${date.getMonth()}`;
      fetch(`/selects/pomerMuziZeny/${selectedDoctor.CISLO_ZAM}`, { headers })
        .then((res) => res.json())
        .then((result) => {
          setMuziZeny({
            labels: ["Muzi", "Zeny"],
            datasets: [
              {
                label: "%",
                data: [result[0].MUZI, result[0].ZENY],
                backgroundColor: ["#42A5F5", "#66BB6A", "#FFA726"],
                hoverBackgroundColor: ["#64B5F6", "#81C784", "#FFB74D"],
              },
            ],
          });
        });

      fetch(`/selects/krvneSkupinyOddelenia/${selectedDoctor.CISLO_ZAM}`, {
        headers,
      })
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
          setKrv({
            labels: result.map((item) => item.TYP_KRVI),
            datasets: [
              {
                data: result.map((item) => item.POCET),
                backgroundColor: [
                  "#ff595e",
                  "#ffca3a",
                  "#8ac926",
                  "#82A5F5",
                  "#1982c4",
                  "#6a4c93",
                  "#BBDEF0",
                  "#00A6A6",
                ],
                hoverBackgroundColor: [
                  "#ff595e",
                  "#ffca3a",
                  "#8ac926",
                  "#82A5F5",
                  "#1982c4",
                  "#6a4c93",
                  "#BBDEF0",
                  "#00A6A6",
                ],
              },
            ],
          });
        });

      fetch(
        `/selects/pocetZamOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetZam(result[0].POCET_ZAMESTNANCOV);
        });

      fetch(
        `/selects/pocetOperOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetOpe(result[0].POC_OPERACII);
        });

      fetch(
        `/selects/pocetHospitOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetHosp(result[0].POC_HOSPITALIZACII);
        });

      fetch(
        `/selects/pocetVyseOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetVys(result[0].POC_VYS);
        });

      fetch(`/selects/pocetPacOddelenia/${selectedDoctor.CISLO_ZAM}`, {
        headers,
      })
        .then((res) => res.json())
        .then((result) => {
          setPocetPac(result[0].POCET_PACIENTOV);
        });
      fetch(`/selects/pocetPacientiPodlaVeku/${selectedDoctor.CISLO_ZAM}`, {
        headers,
      })
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
    <div style={{ padding: "10px" }}>
      {department != null ? (
        <h1 style={{ textAlign: "center" }}>
          Štatistiky pre oddelenie {department.NAZOV}
        </h1>
      ) : (
        ""
      )}
      <div>
        <Toast ref={toast} />
        <div style={{ display: "flex" }}>
          <div
            className="field col-2 md:col-1"
            style={{
              height: "62px",
              display: "flex",
              alignItems: "center",
              marginRight: "20px",
            }}
          >
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h2>Celý rok?</h2>
            </label>
            <Checkbox
              checked={wholeYearCheck}
              onChange={(e) => setWholeYearCheck(e.checked)}
            />
          </div>
          <div
            className="field col-4 md:col-4"
            style={{ height: "62px", display: "flex", alignItems: "center" }}
          >
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h2>Zadajte {wholeYearCheck ? "rok" : "mesiac a rok"}</h2>
            </label>
            <Calendar
              id="range"
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              style={{ width: "55%" }}
              locale="sk"
              view={wholeYearCheck ? "year" : "month"}
              dateFormat={wholeYearCheck ? "yy" : "MM yy"}
              readOnlyInput
            />
          </div>
          <div
            className="field col-4 md:col-3"
            style={{ height: "62px", display: "flex", alignItems: "center" }}
          >
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h2>Vyberte lekára</h2>
            </label>
            <Dropdown
              options={doctors}
              style={{ width: "50%" }}
              optionLabel={"name"}
              value={selectedDoctor}
              onChange={(e) => setSelectedDoctor(e.value)}
            />
          </div>
          <div className="field col-4 md:col-3">
            <Button
              icon="pi pi-check"
              label="Zadaj"
              onClick={handleSubmit}
            ></Button>
          </div>
        </div>
        {render && !loading ? (
          <>
            <div className="xl:col-12">
              <div className="grid">
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                  Počet pacientov
                  <p>{pocetPac}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                  Počet zamestnancov
                  <p>{pocetZam}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                  Počet vykonaných operácií
                  <p>{pocetOpe}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                  Počet vykonaných hospitalizácií
                  <p>{pocetHosp}</p>
                </div>
                <div className="col h-8rem text-center m-3 border-round-lg text-50 font-bold text-xl count-card">
                  Počet vykonaných vyšetrení
                  <p>{pocetVys}</p>
                </div>
              </div>
            </div>
            <div className="xl:col-12 justify-content-center align-content-center flex">
              <Chart
                type="bar"
                data={pacientiVek}
                options={pacientiVekOptions}
                style={{ width: "35%" }}
              />
            </div>
            <div className="xl:col-12 justify-content-center align-content-center flex h-auto">
              <Chart
                type="pie"
                data={muziZeny}
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Podiel pohlaví pacientov (%)",
                    },
                  },
                }}
                style={{ position: "relative", width: "30%" }}
              />
              <Chart
                type="pie"
                options={{
                  plugins: {
                    title: {
                      display: true,
                      text: "Podiel typu krvi u pacientov",
                    },
                  },
                }}
                data={krv}
                style={{ position: "relative", width: "30%" }}
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
