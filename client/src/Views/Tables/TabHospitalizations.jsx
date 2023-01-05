import { useEffect, useState } from 'react';
import mockDataJson from '../../mock/mock-data.json';
import TableMedicalRecord from './TableMedicalRecord';

export default function TabHospitalizations() {
  const [mockData, setMockData] = useState([]);

  useEffect(()=>{
    setMockData(mockDataJson.data);
  },[])

  const data={
    tableName:'Hospitalizácie',
    cellData: mockData,
    titles: [{field: "price", header: 'Rodné číslo'},
             {field: "code", header:'Meno'},
             {field: "description", header: 'Priezvisko'},
             {field: "category", header: 'Dátum prijatia'},
             {field: "id", header: 'Dátum prepustenia'}]
  }

  return (
    <div>
      <TableMedicalRecord {...data}/>
    </div>
  )
}
