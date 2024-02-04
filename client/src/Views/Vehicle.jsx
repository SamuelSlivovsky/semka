import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import VehicleForm from "../Forms/VehicleForm";
import VehicleDetails from "./VehicleDetails";
import { FilterMatchMode } from 'primereact/api';
import "../styles/vehicle.css";
import 'primeicons/primeicons.css';

export default function Vehicle() {
  const [vehicles, setVehicles] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [vehicleDetailsVisible, setVehicleDetailsVisible] = useState(false);
  const [editVehicle, setEditVehicle] = useState(false);
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    'NAZOV': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'ECV': { value: null, matchMode: FilterMatchMode.STARTS_WITH },
    'TYP_VOZIDLA': { value: null, matchMode: FilterMatchMode.STARTS_WITH }
});

  useEffect(() => {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      
      fetch(`/vozidla/all`, { headers })
        .then((response) => response.json())
        .then((data) => {
          setVehicles(data);
        });
  }, [vehicles]);

  const handleClick = (value) => {
      setSelectedRow(value);
  };

  const handleDoubleClick = () => {
    setVehicleDetailsVisible(true);
  }

  const closeEditVehicleDialog = () => {
    setEditVehicle(false);
  }

  const closeVehicleDetailsDialog = () => {
    setVehicleDetailsVisible(false);
  }

  const handleEdit = () => {
    setEditVehicle(true);
  }

  const renderIsVehicleFree = (isFree) => {
      return isFree ? <div className="icon-vehicle free"></div> : <div className="icon-vehicle not-free"></div>;
  }
  const renderEditIcon = () => {
      return <i className="pi pi-pencil vehicle-edit-icon" onClick={ () => handleEdit() }></i>;
  }
  const renderDeleteIcon = () => {
      return <i className="pi pi-trash vehicle-delete-icon"></i>;
  }

  return ( 
    <div className="vehicles">
        <div className="vehicles-header">
            <h1>Vozidlá</h1>
            <VehicleForm
              edit={editVehicle}
              body={selectedRow}
              closeDialog={closeEditVehicleDialog}
            />
        </div>
        
        <div>
        <DataTable
            value = {vehicles}
            selectionMode="single"
            selection={selectedRow}
            onSelectionChange={(e) => handleClick(e.value)}
            onRowDoubleClick={(e) => handleDoubleClick()}
            paginator  
            rowsPerPageOptions={[10, 20, 30]}
            filters={filters}
            globalFilterFields={['NAZOV', 'ECV', 'TYP_VOZIDLA']} emptyMessage="Nenašla sa zhoda."
            filterDisplay="menu"
            removableSort rows={10}
            onFilter={(e) => {
              setFilters(e.filters);
          }}
        >
          <Column field="NAZOV" header={"Nemocnica"} filter className="field-hospital-name" sortable></Column>
          <Column field="ECV" header={"EČV"} filter ></Column>
          <Column field="TYP_VOZIDLA" header={"Typ vozidla"} filter></Column>
          <Column field="DAT_PRIRADENIA" header={"Priradenia"}></Column>
          <Column field="DAT_STK" header={"STK"} ></Column>
          <Column field="OBRAZOK" header={"OBRAZOK"} style={{ display: 'none' }}></Column>
          <Column field={ renderIsVehicleFree } header={"Voľné"} className="field-is-vehicle-free"></Column>
          <Column field={ renderEditIcon }></Column>
          <Column field={ renderDeleteIcon }></Column>                
      </DataTable>
    </div> 
      <VehicleDetails 
        visible={vehicleDetailsVisible}
        body={selectedRow}
        closeDialog={closeVehicleDetailsDialog}
      />
    </div>
  )
};