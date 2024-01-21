import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import { useEffect, useState } from "react";
import 'primeicons/primeicons.css';
import "../styles/departure.css"

export default function Departures() {
  const [departures, setDepartures] = useState([]);
  const [departureHistory, setDepartureHistory] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vyjazdy/departures`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDepartures(data);
      });
  }, [departures]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vyjazdy/departuresHistory`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDepartureHistory(data);
      });
  }, [departureHistory]);


  const handleEdit = () => {
    
  }

  const renderEditIcon = () => {
    return <i className="pi pi-pencil vehicle-edit-icon" onClick={ () => handleEdit() }></i>;
  }

  const renderDeleteIcon = () => {
    return <i className="pi pi-trash vehicle-delete-icon"></i>;
  }

  const renderLeftCardHead = () => {
    return <div className="left-card-header"><h1>Výjazdy</h1><Button label={<i className="pi pi-plus"></i>}></Button></div>
  }

  return (
    <div className="departure-container">
      <div className="departure-content">
        <Card title={renderLeftCardHead} className="departure-left-card departure-card">
          <DataTable
              value={departures}
              selectionMode="single"
              //selection={selectedRow}
              //onSelectionChange={(e) => handleClick(e.value)}
              //onRowDoubleClick={(e) => handleDoubleClick()}
              paginator rows={5} 
          >
            <Column field="PLANOVANY_VYJAZD" header={"Dátum a čas výjazdu"} filter></Column>
            <Column field="NAZOV" header={"Typ výjazdu"} filter></Column>
            <Column field="ECV" header={"Priradené vozidlo"} filter></Column>
            <Column field={ renderEditIcon }></Column>
            <Column field={ renderDeleteIcon }></Column>                
          </DataTable>
        </Card>
        <Card title="História výjazdov" className="departure-right-card departure-card">
          <DataTable
              value={departureHistory}
              selectionMode="single"
              //selection={selectedRow}
              //onSelectionChange={(e) => handleClick(e.value)}
              //onRowDoubleClick={(e) => handleDoubleClick()}
              paginator rows={10} 
              rowsPerPageOptions={[10, 20, 30]}
          >
            <Column field="DATUM_VYJAZDU" header={"Dátum a čas výjazdu"} ></Column>
            <Column field="NAZOV" header={"Typ výjazdu"} ></Column>
            <Column field="ECV" header={"Priradené vozidlo"} ></Column>            
          </DataTable>
        </Card>
      </div> 
    </div>
  )
}