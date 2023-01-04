import { useEffect, useState } from 'react';
import mockDataJson from '../../mock/mock-data.json';
import TableMedicalRecord from './TableMedicalRecord';

export default function TabExaminations() {
  const [mockData, setMockData] = useState([]);

  useEffect(()=>{
    setMockData(mockDataJson.data);
  },[])

  const data={
    tableName:'Vyšetrenia',
    cellData: mockData,
    titles: [{field: "id", header: 'Rodné číslo'},
             {field: "name", header:'Meno'},
             {field: "code", header: 'Priezvisko'},
             {field: "price", header: 'Dátum'}]
  }

  return (
    <div>
      <TableMedicalRecord {...data}/>
    </div>
  )
}