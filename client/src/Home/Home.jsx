import React from "react";
import { Card } from "primereact/card";
import { useNavigate } from "react-router-dom";
import calendarIcon from "../images/calendar.png";
import patientIcon from "../images/patient.png";
import doctorsIcon from "../images/doctors.png";
import examinationIcon from "../images/examination.png";
import hospitalizationIcon from "../images/hospit.png";
import operationIcon from "../images/operation.png";

function Home() {
  const navigate = useNavigate();

  return (
    <div>
      <Card
        title="Kalendár"
        className="card-shadow"
        onClick={() => navigate("/calendar")}
      >
        <div
          style={{
            backgroundImage: `url(${calendarIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        >
          <p className="m-0 calendar-card-day">
            {new Date().toLocaleString("en-US", { day: "2-digit" })}
          </p>
        </div>
        <p>Event</p>
      </Card>
      <Card
        title="Pacienti"
        className="card-shadow"
        onClick={() => navigate("/patients")}
      >
        <div
          style={{
            backgroundImage: `url(${patientIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        ></div>
      </Card>
      <Card title="Lekári" className="card-shadow">
        <div
          style={{
            backgroundImage: `url(${doctorsIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        ></div>
      </Card>
      <Card title="Hospitalizácie" className="card-shadow">
        <div
          style={{
            backgroundImage: `url(${hospitalizationIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        ></div>
      </Card>
      <Card title="Vyšetrenia" className="card-shadow">
        <div
          style={{
            backgroundImage: `url(${examinationIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        ></div>
      </Card>
      <Card title="Operácie" className="card-shadow">
        <div
          style={{
            backgroundImage: `url(${operationIcon})`,
            backgroundSize: "65%",
            backgroundRepeat: "no-repeat",
            backgroundPosition: "center",
            height: "180px",
          }}
        ></div>
      </Card>
    </div>
  );
}

export default Home;
