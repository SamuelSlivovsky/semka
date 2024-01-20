import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import DeparturePlansForm from "../Forms/DeparturePlansForm";
import "../styles/departurePlans.css";
import 'primeicons/primeicons.css';

export default function DeparturePlans() {

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
            //value = {}
            selectionMode="single"
            //selection={selectedRow}
            //onSelectionChange={(e) => handleClick(e.value)}
            //onRowDoubleClick={(e) => handleDoubleClick()}
            paginator rows={10} 
            rowsPerPageOptions={[10, 20, 30]}
        >
          <Column  header={"Typ výjazdu"} filter className="field-hospital-name"></Column>
          <Column  header={"Dátum priradenia"} filter></Column>
          <Column  header={"Odkiaľ"} filter></Column>
          <Column  header={"Kam"} filter></Column>
          <Column field={ renderEditIcon }></Column>
          <Column field={ renderDeleteIcon }></Column>                
      </DataTable>
    </div> 
    </div>
  );
}