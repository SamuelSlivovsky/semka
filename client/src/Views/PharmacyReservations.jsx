import React, { useState, useEffect, useRef } from "react";
import HomeCard from "../Home/HomeCard";
import "../styles/homepage.css";
import reservationsIcon from "../images/reservations.png";
import GetUserData from "../Auth/GetUserData";
import { useNavigate } from "react-router";
import { Toast } from "primereact/toast";

function PharmacyReservations() {
  const [aktualneRezervacieLiekov, setAktualneRezervacieLiekov] = useState([]);
  const [aktualneRezervacieZdrPomocok, setAktualneRezervacieZdrPomocok] =
    useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [aktualnyPocetLieku, setAktualnyPocetLieku] = useState([]);
  const [aktualnyPocetZdrPomocky, setAktualnyPocetZdrPomocky] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    getPocetAktualnychRezervaciiLieku(userDataHelper, headers);
    getPocetAktualnychRezervaciiZdrPomocky(userDataHelper, headers);
  }, []);

  const getPocetAktualnychRezervaciiLieku = (userDataHelper, headers) => {
    fetch(
      `/pharmacyManagers/getZoznamAktualnychRezervaciiLieku/${userDataHelper.UserInfo.userid}`,
      {
        headers,
      }
    )
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
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
      .then((data) => {
        setAktualneRezervacieLiekov(data);
        setAktualnyPocetLieku(data.length);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getPocetAktualnychRezervaciiZdrPomocky = (userDataHelper, headers) => {
    fetch(
      `/pharmacyManagers/getZoznamAktualnychRezervaciiZdrPomocky/${userDataHelper.UserInfo.userid}`,
      {
        headers,
      }
    )
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
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
      .then((data) => {
        setAktualneRezervacieZdrPomocok(data);
        setAktualnyPocetZdrPomocky(data.length);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const pharmacyStorageCards = [
    <HomeCard
      title="Rezervácie liekov"
      isCalendar={false}
      path="/medicaments_reservations"
      icon={reservationsIcon}
      countMed={aktualnyPocetLieku}
      key="30"
    ></HomeCard>,
    <HomeCard
      title="Rezervácie zdr. pomôcok"
      isCalendar={false}
      path="/medical_aids_reservations"
      icon={reservationsIcon}
      countAid={aktualnyPocetZdrPomocky}
      key="31"
    ></HomeCard>,
  ];

  const renderPharmacyReservationsCards = () => {
    return pharmacyStorageCards;
  };

  return <div>{renderPharmacyReservationsCards()}</div>;
}

export default PharmacyReservations;
