import React, { useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
export default function Combobox() {
  const [select, setSelect] = useState(null);
  const [valuesInTable, setValuesInTable] = useState([]);
  const [columns, setColumns] = useState([]);
  const selects = [
    //{ name: 'Pacienti', path: 'PA' },
    //{ name: 'Lekári', path: 'LE' },
    { name: 'Operácie', path: 'operacia/operacie' },
    //{ name: 'Vyšetrena', path: 'VY' },
    //{ name: 'Hospitalizácie', path: 'HO' },
  ];

  const onSelectChange = (e) => {
    setSelect(e.value);
  };

  const handleSubmit = () => {
    fetch(`http://localhost:5000/${select.path}`)
      .then((res) => res.json())
      .then((result) => {
        loadColumnsHeaders(result);
        setValuesInTable(result);
        console.log(valuesInTable);
      });
  };

  const loadColumnsHeaders = (data) => {
    if (Object.keys(...data).length > 0) {
      loadColumns(Object.keys(...data));
    }
  };

  const handleClick = (rowData) => {
    console.log(rowData);
  };

  const actionBodyTemplate = (rowData) => {
    if (rowData.key !== 'empty') {
      return (
        <React.Fragment>
          <Button
            label='XML'
            style={{ marginRight: '10px' }}
            onClick={() => handleClick(rowData)}
          />
          <Button label='JSON' onClick={() => handleClick(rowData)} />
        </React.Fragment>
      );
    }
  };

  const loadColumns = (keys) => {
    let array = '';
    keys.forEach((element) => {
      array = [
        ...array,
        <Column field={element} header={element} key={element}></Column>,
      ];
    });
    array = [
      ...array,
      <Column key='button' body={actionBodyTemplate}></Column>,
    ];
    setColumns(array);
  };

  return (
    <div className='card'>
      <Dropdown
        value={select}
        options={selects}
        onChange={onSelectChange}
        optionLabel='name'
        placeholder='Vyber select'
      />
      <Button icon='pi pi-check' label='Zadaj' onClick={handleSubmit}></Button>
      <div className='card'>
        <DataTable
          value={valuesInTable}
          scrollable
          scrollHeight='600px'
          responsiveLayout='scroll'
        >
          {columns}
        </DataTable>
      </div>
    </div>
  );
}
