import { Dialog } from "primereact/dialog";
import { Card } from 'primereact/card';
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../styles/vehicleDetails.css";

export default function VehicleDetails(props) {
  const onHideVehicleDetails = () => {
    props.closeDialog();
  };

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
          <Card title="Informácie o vozidle" className="vehicle-details-first-row-left-card vehicle-details-left-card">
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
          <Card title="Plánované výjazdy" className="vehicle-details-first-row-right-card vehicle-details-right-card">
            <DataTable>
              <Column header={"Typ výjazdu"} className="field-type-name"></Column>
              <Column header={"Dátum priradenia"} className="field-date-name"></Column>
              <Column header={"Odkiaľ"} className="field-where-from-name"></Column>
              <Column header={"Kam"} className="field-where-to-name"></Column>
            </DataTable>
          </Card>
        </div>
        <div className="vehicle-details-row">
          <Card title="Vybavenie voidla" className="vehicle-details-second-row-left-card vehicle-details-left-card">
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
            <DataTable>
              <Column header={"Typ výjazdu"} className="field-type-name"></Column>
              <Column header={"Dátum priradenia"} className="field-date-name"></Column>
              <Column header={"Odkiaľ"} className="field-where-from-name"></Column>
              <Column header={"Kam"} className="field-where-to-name"></Column>
            </DataTable>
          </Card>
        </div>
      </Dialog>
    </div>
  )
}