import { useEffect, useState } from 'react';
import mockDataJson from '../../mock/mock-data.json';
import TableMedicalRecord from './TableMedicalRecord';

export default function TabOperations() {
  const [mockData, setMockData] = useState([]);

  useEffect(()=>{
    setMockData(mockDataJson.data);
  },[])

  const data={
    tableName:'Operácie',
    cellData: mockData,
    titles: [{field: "id", header: 'Rodné číslo'},
             {field: "name", header:'Meno'},
             {field: "code", header: 'Priezvisko'},
             {field: 'description', header: 'Dátum'}]
  }

  return (
    <div>
      <TableMedicalRecord {...data}/>
    </div>
  )
}