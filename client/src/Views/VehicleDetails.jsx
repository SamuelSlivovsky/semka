import { Dialog } from "primereact/dialog";
import { Card } from 'primereact/card';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { useEffect } from 'react';
import { useState } from 'react';
import "../styles/vehicleDetails.css";

export default function VehicleDetails(props) {
  const [vehPlan, setVehPlan] = useState([]);
  const [planHistory, setPlanHistory] = useState([]);
  const onHideVehicleDetails = () => {
    props.closeDialog();
  };

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    if (props.body) {
      fetch(`/vozidla/vozidloPlanHist/${props.body.ECV}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setPlanHistory(data);
      });
    }
  }, [props.body]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    if (props.body) {
      fetch(`/vozidla/vozidloPlan/${props.body.ECV}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVehPlan(data);
      });
    }
  }, [props.body]);

  return (
    <div>
      <Dialog
        className="vehicle-details-dialog"
        header="Detaily vozidla"
        visible={props.visible}
        style={{ width: "80rem" }}
        onHide={() => onHideVehicleDetails()} 
      >
        <div className="vehicle-details-row">
          <Card className="vehicle-details-first-row-left-card vehicle-details-left-card">
            <img className="vehicle-details-img" src={props.body && props.body.OBRAZOK ? "data:image/png;base64, " + props.body.OBRAZOK : ""}/>
          </Card>
          <Card title="Plánované výjazdy" className="vehicle-details-first-row-right-card vehicle-details-right-card">
            <DataTable
              value={vehPlan}
              paginator rows={2}
            >
              <Column field="NAZOV" header={"Typ výjazdu"} className="field-type-name"></Column>
              <Column field="DATUM_CAS" header={"Dátum a čas"} className="field-date-name"></Column>
              <Column field="ODKIAL"  header={"Odkiaľ"} className="field-where-from-name"></Column>
              <Column field="KAM"  header={"Kam"} className="field-where-to-name"></Column>
            </DataTable>
          </Card>
        </div>
        <div className="vehicle-details-row">
          <Card title="Informácie o vozidle" className="vehicle-details-second-row-left-card vehicle-details-left-card">
          <div className="row">
              <div className="left-element"> <span>Nemocnica:</span> </div>
              <div className="right-element"> <span>{props.body != null ? props.body.NAZOV : ""}</span> </div>
            </div>
            <div className="row">
              <div className="left-element"> <span>EČV:</span> </div>  
              <div className="right-element"> <span>{props.body != null ? props.body.ECV : ""}</span> </div>
            </div>
            <div className="row">
              <div className="left-element"> <span>Typ vozidla:</span> </div>
              <div className="right-element"> <span>{props.body != null ? props.body.TYP_VOZIDLA : ""}</span> </div>
            </div>
            <div className="row">
              <div className="left-element"> <span>Dátum STK:</span> </div>
              <div className="right-element"> <span>{props.body != null ? props.body.DAT_STK : ""}</span> </div>
            </div>
            <div className="row">
              <div className="left-element"> <span>Dátum priradenia:</span> </div>
              <div className="right-element"> <span>{props.body != null ? props.body.DAT_PRIRADENIA : ""}</span> </div>
            </div>
          </Card>
          <Card title="História výjazdov vozidla" className="vehicle-details-second-row-right-card vehicle-details-right-card">
            <DataTable
              value = {planHistory}
              paginator rows={2}
            >
              <Column field="NAZOV" header={"Typ výjazdu"} className="field-type-name"></Column>
              <Column field="DATUM_CAS" header={"Dátum a čas"} className="field-date-name"></Column>
              <Column field="ODKIAL"  header={"Odkiaľ"} className="field-where-from-name"></Column>
              <Column field="KAM"  header={"Kam"} className="field-where-to-name"></Column>
            </DataTable>
          </Card>
        </div>
      </Dialog>
    </div>
  )
}