import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import examinationIcon from "../images/examination.png";
import hospitalizationIcon from "../images/hospit.png";
import operationIcon from "../images/operation.png";

function Patient() {
  return (
    <div>
      <div className="flex col-12">
        <Card className="col-5" style={{ height: "100%" }} title="Pepega Omega">
          <div className="flex">
            <div className="col-5 text-center m-0">
              <h4>Rok narodenia</h4>
              <div>15.9.1985</div>
            </div>

            <div className="col-5 text-center m-0">
              <h4>Mobil</h4>
              <div>+421123456789</div>
            </div>
          </div>

          <div className="flex w-100">
            <div className="col-5 text-center m-0">
              <h4>Vek</h4>
              <div>37</div>
            </div>
            <div className="col-5 text-center m-0">
              <h4>Email</h4>
              <div>pepega.omega@gmail.com</div>
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

        <Card className="col-4" title="Recepty" style={{ height: "100%" }}>
          <DataTable responsiveLayout="scroll" selectionMode="single">
            <Column field="Názov lieku" header="Názov lieku"></Column>
          </DataTable>
        </Card>
      </div>

      <div className="col-12 flex">
        <Card
          className="col-5"
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
              icon={examinationIcon}
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová operácia"
              icon={operationIcon}
            />
          </div>
          <div className="p-3">
            <Button
              style={{ width: "100%" }}
              label="Nová hospitalizácia"
              icon={hospitalizationIcon}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
export default Patient;
