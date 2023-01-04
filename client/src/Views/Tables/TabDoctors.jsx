import TablePeople from './TablePeople';
import mockDataJson from '../../mock/mock-data.json';
import { useState } from 'react';
import { useEffect } from 'react';

export default function TabDoctros() {
  const [mockData, setMockData] = useState([]);

  useEffect(()=>{
    setMockData(mockDataJson.data);
  },[])

  const tableData={
    tableName:'Doktori',
    route:'/doktor',
    cellData: mockData,
    titles: [{field: "category", header: 'Oddelenie'},
             {field: "description", header:'Meno'},
             {field: "name", header: 'Priezvisko'}]
  }

 
  return (
    <div>
      <TablePeople {...tableData}/>
    </div>
  )
}

