import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import "../styles/vehicle.css";
import 'primeicons/primeicons.css';
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import VehicleForm from "../Forms/VehicleForm";
import "../styles/vehicleForm.css"

export default function Vehicle() {
const [vehicles, setVehicles] = useState([]);
const [selectedRow, setSelectedRow] = useState(null);
const [newVehicleShowDialog, setNewVehicleShowDialog] = useState(false);

useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    //const userDataHelper = GetUserData(token);
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vozidla/all`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVehicles(data);
      });
}, []);

const handleClick = (value) => {
    setSelectedRow(value);
    console.log(value);
};

const handleEdit = (value) => {
    console.log(value);
}

const renderIsVehicleFree = (isFree) => {
    return isFree ? <div className="icon-vehicle free"></div> : <div className="icon-vehicle not-free"></div>;
}
const renderEditIcon = () => {
    return <i className="pi pi-pencil vehicle-edit-icon" onClick={ (e) => handleEdit(e.value) }></i>;
}
const renderDeleteIcon = () => {
    return <i className="pi pi-trash vehicle-delete-icon"></i>;
}

return ( 
    <div className="vehicles">
        <div className="vehicles-header">
            <h1>Vozidlá</h1>
            <VehicleForm/> 
        </div>
        
        <div>
        <DataTable
            value = {vehicles}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => handleClick(e.value)}
            paginator rows={10} 
            rowsPerPageOptions={[10, 20, 30]}
        >
          <Column field="NAZOV" header={"Nemocnica"} filter className="field-hospital-name"></Column>
          <Column field="ECV" header={"EČV"} filter></Column>
          <Column field="TYP_VOZIDLA" header={"Typ vozidla"} filter></Column>
          <Column field="DAT_PRIRADENIA" header={"Priradenia"} filter></Column>
          <Column field="DAT_STK" header={"STK"} filter></Column>
          <Column field={ renderIsVehicleFree } header={"Voľné"} className="field-is-vehicle-free"></Column>
          <Column field={ renderEditIcon }></Column>
          <Column field={ renderDeleteIcon }></Column>                
      </DataTable>
    </div> 
    </div>
  )
};