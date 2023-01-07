import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useLocation } from "react-router";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { InputTextarea } from "primereact/inputtextarea";
import "../icons.css";

export default function ProfileCard() {
  const [profile, setProfile] = useState("");
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [eventType, setEventType] = useState("");
  const [header, setHeader] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    fetch(`patient/info/${location.state}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(...data);
        setProfile(...data);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (eventType) => {
    setEventType(eventType);
    switch (eventType) {
      case "examination":
        setHeader("Vytvoriť nové vyšetrenie");
        break;
      case "operation":
        setHeader("Vytvoriť novú operáciu");
        break;
      case "hospit":
        setHeader("Vytvoriť novú hospitalizáciu");
        break;
      default:
        break;
    }
    setShow(true);
  };

  const onHide = () => {
    setShow(false);
  };

  const examinationDialog = () => {
    return (
      <div className="p-fluid grid formgrid">
        <div className="field col-12 ">
          <label htmlFor="basic">Dátum vyšetrenia</label>
          <Calendar id="basic" showTime showIcon dateFormat="dd.mm.yy" />
        </div>
        <div className="field col-12 ">
          <label htmlFor="basic">Popis</label>
          <InputTextarea
            rows={5}
            cols={30}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoResize
          />
        </div>
      </div>
    );
  };

  const operationDialog = () => {
    return (
      <div className="p-fluid grid formgrid">
        <div className="field col-12 ">
          <label htmlFor="basic">Dátum operácie</label>
          <Calendar id="basic" showTime showIcon dateFormat="dd.mm.yy" />
        </div>
        <div className="field col-12 ">
          <label htmlFor="basic">Popis</label>
          <InputTextarea
            rows={5}
            cols={30}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoResize
          />
        </div>
      </div>
    );
  };

  const hospitDialog = () => {
    return (
      <div className="p-fluid grid formgrid">
        <div className="field col-12 ">
          <label htmlFor="basic">Dátum od</label>
          <Calendar id="basic" showTime showIcon dateFormat="dd.mm.yy" />
        </div>
        <div className="field col-12 ">
          <label htmlFor="basic">Dátum do</label>
          <Calendar id="basic" showTime showIcon dateFormat="dd.mm.yy" />
        </div>
        <div className="field col-12 ">
          <label htmlFor="basic">Popis</label>
          <InputTextarea
            rows={5}
            cols={30}
            value={text}
            onChange={(e) => setText(e.target.value)}
            autoResize
          />
        </div>
      </div>
    );
  };

  const renderDialog = () => {
    switch (eventType) {
      case "examination":
        return examinationDialog();
      case "operation":
        return operationDialog();
      case "hospit":
        return hospitDialog();
      default:
        break;
    }
  };

  return (
    <div>
      <div className="flex col-12 ">
        <Card
          className="col-5 shadow-4"
          style={{ height: "100%" }}
          title={profile.MENO + " " + profile.PRIEZVISKO}
        >
          <div className="flex ">
            <div className="col-5 text-center m-0">
              <h4>Rok narodenia</h4>
              <div>{profile.DATUM_NARODENIA}</div>
            </div>

            <div className="col-5 text-center m-0">
              <h4>Mobil</h4>
              <div>{profile.TEL}</div>
            </div>
          </div>

          <div className="flex w-100">
            <div className="col-5 text-center m-0">
              <h4>Vek</h4>
              <div>{profile.VEK}</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Email</h4>
              <div>{profile.MAIL}</div>
            </div>
          </div>

          <div className="flex">
            <div className="col-5 text-center m-0">
              <h4>Krvna skupina</h4>
              <div>{profile.KRVNA_SKUPINA}</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Adresa</h4>
              <div>{profile.NAZOV + " " + profile.PSC}</div>
            </div>
          </div>
          <div className="mt-5 text-center">
            <Button label="Poslať správu" icon="pi pi-send" />
          </div>
        </Card>

        <Card
          className="col-4 shadow-4"
          title="Recepty"
          style={{ height: "100%" }}
        >
          <DataTable responsiveLayout="scroll" selectionMode="single">
            <Column field="Názov lieku" header="Názov lieku"></Column>
          </DataTable>
        </Card>
      </div>

      <div className="col-12 flex">
        <Card
          className="col-5 shadow-4"
          title="Zdravotné záznamy"
          style={{ height: "100%" }}
        >
          <DataTable responsiveLayout="scroll" selectionMode="single">
            <Column field="Dátum" header="Dátum"></Column>
            <Column field="Typ záznamu" header="Typ záznamu"></Column>
            <Column field="Oddelenie" header="Oddelenie"></Column>
            <Column field="Lekár" header="Lekár"></Column>
          </DataTable>
        </Card>

        <div className="col-4 m-4">
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nové vyšetrenie"
              icon="examination-icon"
              onClick={() => handleClick("examination")}
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová operácia"
              icon="operation-icon"
              onClick={() => handleClick("operation")}
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová hospitalizácia"
              icon="hospit-icon"
              onClick={() => handleClick("hospit")}
            />
          </div>
        </div>
      </div>
      <Dialog visible={show} onHide={onHide} header={header}>
        {renderDialog()}
      </Dialog>
    </div>
  );
}
