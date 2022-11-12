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
          }}
          className="card-content"
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
          className="card-content"
          style={{
            backgroundImage: `url(${patientIcon})`,
          }}
        ></div>
      </Card>
      <Card title="Lekári" className="card-shadow">
        <div
          className="card-content"
          style={{
            backgroundImage: `url(${doctorsIcon})`,
          }}
        ></div>
      </Card>
      <Card title="Hospitalizácie" className="card-shadow">
        <div
          className="card-content"
          style={{
            backgroundImage: `url(${hospitalizationIcon})`,
          }}
        ></div>
      </Card>
      <Card title="Vyšetrenia" className="card-shadow">
        <div
          className="card-content"
          style={{
            backgroundImage: `url(${examinationIcon})`,
          }}
        ></div>
      </Card>
      <Card title="Operácie" className="card-shadow">
        <div
          className="card-content"
          style={{
            backgroundImage: `url(${operationIcon})`,
          }}
        ></div>
      </Card>
    </div>
  );
}

export default Home;
