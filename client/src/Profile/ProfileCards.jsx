import React, { useEffect, useState } from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../icons.css";

export default function ProfileCard() {
  const [profile, setProfile] = useState("");
  useEffect(() => {
    fetch(`/lekar/pacienti/${2}`)
      .then((response) => response.json())
      .then((data) => {
        setProfile(data[1]);
      });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps
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
              <div>15.9.1985</div>
            </div>

            <div className="col-5 text-center m-0">
              <h4>Mobil</h4>
              <div>{profile.TEL}</div>
            </div>
          </div>

          <div className="flex w-100">
            <div className="col-5 text-center m-0">
              <h4>Vek</h4>
              <div>37</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Email</h4>
              <div>{profile.MAIL}</div>
            </div>
          </div>

          <div className="flex">
            <div className="col-5 text-center m-0">
              <h4>Krvna skupina</h4>
              <div>AB+</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Adresa</h4>
              <div>Krížna 54, 01234, Bratislava</div>
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
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová operácia"
              icon="operation-icon"
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová hospitalizácia"
              icon="hospit-icon"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
