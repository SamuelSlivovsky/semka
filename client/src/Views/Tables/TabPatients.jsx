import TablePeople from './TablePeople';
import mockDataJson from '../../mock/mock-data.json';
import { useState } from 'react';
import { useEffect } from 'react';

export default function TabPatients() {
  const [mockData, setMockData] = useState([]);

  useEffect(()=>{
    setMockData(mockDataJson.data);
  },[])

  const tableData={
    tableName:'Pacienti',
    route:'/patient',
    cellData: mockData,
    titles: [{field: "id", header: 'Rodné číslo'},
             {field: "code", header:'Meno'},
             {field: "name", header: 'Priezvisko'}]
  }

 
  return (
    <div>
      <TablePeople {...tableData}/>
    </div>
  )
}

