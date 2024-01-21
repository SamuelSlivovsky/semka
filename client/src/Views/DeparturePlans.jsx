import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeparturePlansForm from "../Forms/DeparturePlansForm";
import "../styles/departurePlans.css";
import 'primeicons/primeicons.css';
import { useEffect, useState } from "react";

export default function DeparturePlans() {
  const [departurePlans, setDeparturePlans] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vyjazdy/plans`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDeparturePlans(data);
      });
  }, [departurePlans]);

  const handleEdit = () => {
    
  }

  const renderEditIcon = () => {
    return <i className="pi pi-pencil vehicle-edit-icon" onClick={ () => handleEdit() }></i>;
  }

  const renderDeleteIcon = () => {
    return <i className="pi pi-trash vehicle-delete-icon"></i>;
  }

  return (
    <div className="departure-plans-container">
      <div className="departure-plans-header">
        <h1>Plánované výjazdy</h1>
        <DeparturePlansForm></DeparturePlansForm>
      </div>
      <div className="departure-plans-content">
        <DataTable
            value={departurePlans}
            selectionMode="single"
            //selection={selectedRow}
            //onSelectionChange={(e) => handleClick(e.value)}
            //onRowDoubleClick={(e) => handleDoubleClick()}
            paginator rows={10} 
            rowsPerPageOptions={[10, 20, 30]}
        >
          <Column field="NAZOV" header={"Typ výjazdu"} filter className="field-type"></Column>
          <Column field="PLANOVANY_DATUM" header={"Dátum a čas výjazdu"} filter></Column>
          <Column field="ODKIAL" header={"Odkiaľ"} filter></Column>
          <Column field="KAM" header={"Kam"} filter></Column>
          <Column field="TRVANIE" header={"Trvanie v minútach"} filter></Column>
          <Column field={ renderEditIcon }></Column>
          <Column field={ renderDeleteIcon }></Column>                
      </DataTable>
    </div> 
    </div>
  );
}