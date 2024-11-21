import React, { useEffect, useState } from 'react';
import GetUserData from '../../Auth/GetUserData';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { useNavigate } from 'react-router';
import { InputTextarea } from 'primereact/inputtextarea';
function TabMeetings() {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState([]);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(
    () => {
      const token = localStorage.getItem('hospit-user');
      const userDataHelper = GetUserData(token);
      const headers = { authorization: 'Bearer ' + token };
      fetch(`/api/lekar/konzilia/${userDataHelper.UserInfo.userid}`, {
        headers,
      })
        .then((response) => response.json())
        .then((data) => {
          setMeetings(data);
        });

      initFilters();
    }, // eslint-disable-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    initFilters();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const initFilters = () => {
    setFilters({
      global: { value: null, matchMode: FilterMatchMode.CONTAINS },
      MENO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      PRIEZVISKO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
      ROD_CISLO: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }],
      },
    });
    setGlobalFilterValue('');
  };

  const dateBodyTemplate = (option) => {
    return (
      <span>
        {new Date(option.DATUM).toLocaleString('sk-SK', {
          dateStyle: 'short',
          timeStyle: 'short',
        })}
      </span>
    );
  };

  const patientBodyTemplate = (option) => {
    return (
      <span>
        {option.MENO}, {option.PRIEZVISKO}
      </span>
    );
  };

  const renderHeader = () => {
    return (
      <div className='flex justify-content-between'>
        <div className='table-header' style={{ gap: '10px' }}>
          Pacienti
          <span className='p-input-icon-left'>
            <i className='pi pi-search' />
            <InputText
              value={globalFilterValue}
              onChange={onGlobalFilterChange}
              placeholder='Keyword Search'
            />
          </span>
        </div>
      </div>
    );
  };

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;
    setFilters(_filters);
    setGlobalFilterValue(value);
  };

  const getImages = (row) => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/zaznamy/priloha/${row.ID_ZAZNAMU}`, { headers })
      .then((res) => res.blob())
      .then((result) => {
        return result.map((item) => (
          <img src={URL.createObjectURL(item)} alt='zaznam'></img>
        ));
      });
  };

  const updateMeeting = () => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        id_konzilia: selectedRow.ID_KONZILIA,
        sprava: selectedRow.ZAVERECNA_SPRAVA,
      }),
    };
    fetch('/api/lekar/konzilia/update', requestOptions);
  };

  return (
    <div className='card'>
      <DataTable
        header={renderHeader}
        value={meetings}
        scrollable
        selectionMode='single'
        scrollHeight={`${window.innerHeight - 100}px`}
        filterDisplay='menu'
        filters={filters}
        paginator
        rows={25}
        globalFilterFields={['ROD_CISLO', 'MENO', 'PRIEZVISKO']}
        emptyMessage='Žiadne výsledky nevyhovujú vyhľadávaniu'
        onSelectionChange={(e) => {
          setSelectedRow(e.value);
          getImages(e.value);
          setShow(true);
        }}
      >
        <Column field='DOVOD' header='Dôvod'></Column>
        <Column body={dateBodyTemplate} header='Dátum'></Column>
        <Column body={patientBodyTemplate} header='Pacient'></Column>
        <Column field='ROD_CISLO' header='Rodné číslo'></Column>
      </DataTable>
      <Dialog
        visible={show}
        onHide={() => {
          setSelectedRow(null);
          setShow(false);
          setImages([]);
        }}
        style={{ maxWidth: '80%', minWidth: '600px', wordBreak: 'break-all' }}
      >
        {selectedRow ? (
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <h1>
              Konzílium {selectedRow.MENO} {selectedRow.PRIEZVISKO}
              <Button
                label='Karta pacienta'
                style={{ float: 'right' }}
                onClick={() =>
                  navigate('/patient', { state: selectedRow.ID_PACIENTA })
                }
              ></Button>
            </h1>
            <h2>Dôvod: {selectedRow.DOVOD}</h2>
            <h2>Zdravotný záznam: {selectedRow.NAZOV}</h2>
            <p>{selectedRow.POPIS}</p>
            {images}
            <InputTextarea
              rows={5}
              autoResize
              value={selectedRow.ZAVERECNA_SPRAVA}
              onChange={(e) =>
                setSelectedRow({
                  ...selectedRow,
                  ZAVERECNA_SPRAVA: e.target.value,
                })
              }
            ></InputTextarea>
            <Button
              label='Pridaj záverečnú správu'
              style={{ marginTop: '10px' }}
              onClick={() => updateMeeting()}
            ></Button>
          </div>
        ) : (
          ''
        )}
      </Dialog>
    </div>
  );
}

export default TabMeetings;
