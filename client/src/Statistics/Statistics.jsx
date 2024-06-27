import React, { useState, useRef, useEffect } from "react";

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
import DepartmentStats from "./DepartmentStats.jsx";
import DoctorStats from "./DoctorStats.jsx";
import {useNavigate} from "react-router";
export default function Statistics() {
  const toast = useRef(null);
  const navigate = useNavigate();
  const [render, setRender] = useState(false);
  const [muziZeny, setMuziZeny] = useState(null);
  const [wholeYearCheck, setWholeYearCheck] = useState(false);
  const [pocetZam, setPocetZam] = useState(null);
  const [pocetPac, setPocetPac] = useState(null);
  const [pocetOpe, setPocetOpe] = useState(null);
  const [pocetHosp, setPocetHosp] = useState(null);
  const [pocetVys, setPocetVys] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [departmentEvents, setDepartmentEvents] = useState([]);
  const [krv, setKrv] = useState(null);
  const [date, setDate] = useState("");
  const [pacientiVek, setPacientiVek] = useState(null);
  const [pacientiVekOptions, setPacientiVekOptions] = useState(null);
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [wholeDepartmentCheck, setWholeDepartmentCheck] = useState(true);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userId = GetUserData(token).UserInfo.userid;
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/oddeleniePrimara/${userId}`, { headers })
      .then((res) => {
        if (res.ok) {
          return res.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (res.status === 410) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: "error",
            summary: "Session timeout redirecting to login page",
            life: 999999999,
          });
          setTimeout(() => {
            navigate("/logout");
          }, 3000);
        }
      })
      .then((result) => {
        setDepartment(result);
      });

    fetch(`/lekar/lekari/${userId}`, { headers })
      .then((res) => {
        if (res.ok) {
          return res.json();
          // Kontrola ci je token expirovany (status:410)
        } else if (res.status === 410) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: "error",
            summary: "Session timeout redirecting to login page",
            life: 999999999,
          });
          setTimeout(() => {
            navigate("/logout");
          }, 3000);
        }
      })
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
    const headers = { authorization: "Bearer " + token };
    let selectType = "Zamestnanca";
    if (wholeDepartmentCheck) {
      setSelectedDoctor(
        doctors.find(
          (item) => item.CISLO_ZAM == GetUserData(token).UserInfo.userid
        )
      );
      selectType = "Oddelenia";
    }
    if (date !== null && selectedDoctor !== null) {
      setRender(true);
      setLoading(true);
      const dateParam = wholeYearCheck
        ? date.getFullYear()
        : `${date.getFullYear()}&${date.getMonth() + 1}`;
      if (wholeDepartmentCheck) fetchDepartmentStats(headers, dateParam);
      else fetchDoctorStats(headers, dateParam);

      fetch(
        `/selects/pocetOper${selectType}/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setPocetOpe(result[0].POC_OPERACII);
        });
      fetch(
        `/selects/pocetVyse${selectType}/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
        {
          headers,
        }
      )
        .then((res) => res.json())
        .then((result) => {
          setLoading(false);
          setPocetVys(result[0].POC_VYS);
        });
    } else {
      toast.current.show({
        severity: "error",
        summary: "Zadajte ID oddelenia",
        life: 3000,
      });
    }
  };

  const fetchDepartmentStats = (headers, dateParam) => {
    fetch(`/selects/pomerMuziZeny/${selectedDoctor.CISLO_ZAM}/${dateParam}`, {
      headers,
    })
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

    fetch(
      `/selects/krvneSkupinyOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((result) => {
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
      `/selects/pocetPacientiPodlaVeku/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setPocetPac(result.reduce((total, item) => total + item.POCET, 0));
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
      `/selects/udalostiOddelenia/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setDepartmentEvents(result);
      });
  };

  const fetchDoctorStats = (headers, dateParam) => {
    fetch(
      `/lekar/zoznamVydanychReceptov/${selectedDoctor.CISLO_ZAM}/${dateParam}`,
      {
        headers,
      }
    )
      .then((res) => res.json())
      .then((result) => {
        setRecipes(result);
      });
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
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h3>Celý rok?</h3>
            </label>
            <Checkbox
              checked={wholeYearCheck}
              onChange={(e) => setWholeYearCheck(e.checked)}
            />
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h3>Celé oddelenie?</h3>
            </label>
            <Checkbox
              checked={wholeDepartmentCheck}
              onChange={(e) => setWholeDepartmentCheck(e.checked)}
            />
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
              <h3>Zadajte {wholeYearCheck ? "rok" : "mesiac a rok"}</h3>
            </label>
            <Calendar
              id="range"
              value={date}
              onChange={(e) => {
                setDate(e.value);
              }}
              style={{ width: "55%", height: "40px" }}
              locale="sk"
              view={wholeYearCheck ? "year" : "month"}
              dateFormat={wholeYearCheck ? "yy" : "MM yy"}
              readOnlyInput
            />
          </div>
          {wholeDepartmentCheck ? (
            ""
          ) : (
            <div style={{ display: "flex", alignItems: "center" }}>
              <label htmlFor="withoutgrouping" style={{ marginRight: "1rem" }}>
                <h3>Vyberte lekára</h3>
              </label>
              <Dropdown
                options={doctors}
                style={{ width: "200px", height: "40px" }}
                optionLabel={"name"}
                value={selectedDoctor}
                onChange={(e) => setSelectedDoctor(e.value)}
              />
            </div>
          )}
          <div>
            <Button
              icon="pi pi-check"
              label="Zadaj"
              onClick={handleSubmit}
            ></Button>
          </div>
        </div>
        {render && !loading ? (
          wholeDepartmentCheck ? (
            <DepartmentStats
              pocetPac={pocetPac}
              pocetZam={pocetZam}
              pocetOpe={pocetOpe}
              pocetHosp={pocetHosp}
              pocetVys={pocetVys}
              pacientiVek={pacientiVek}
              pacientiVekOptions={pacientiVekOptions}
              muziZeny={muziZeny}
              krv={krv}
              departmentEvents={departmentEvents}
            />
          ) : (
            <DoctorStats
              pocetOpe={pocetOpe}
              pocetVys={pocetVys}
              recipes={recipes}
            />
          )
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
