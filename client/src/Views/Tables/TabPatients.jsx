import React, { useState, useEffect, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { useNavigate } from 'react-router';
import { Tag } from 'primereact/tag';
import GetUserData from '../../Auth/GetUserData';
import { Toast } from 'primereact/toast';

export default function TabPatients() {
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [filters, setFilters] = useState(null);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const toast = useRef(null);
  const [pacienti, setPacienti] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/lekar/pacienti/${userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => {
        // Kontrola ci response je ok (status:200)
        if (response.ok) {
          return response.json();
        } else if (response.status === 401) {
          // Token expiroval redirect na logout
          toast.current.show({
            severity: 'error',
            summary: 'Session timeout redirecting to login page',
            life: 999999999,
          });
          setTimeout(() => {
            navigate('/logout');
          }, 3000);
        }
      })
      .then((data) => {
        setPacienti(data);
      });
  }, []);

  const onHide = () => {
    setShowDialog(false);
    setSelectedRow(null);
  };

  const onSubmit = () => {
    setShowDialog(false);
    navigate('/patient', { state: selectedRow.ID_PACIENTA });
  };

  const handleClick = (value) => {
    navigate('/patient', { state: value.ID_PACIENTA });
  };

  const renderDialogFooter = () => {
    return (
      <div>
        <Button
          label='Zatvoriť'
          icon='pi pi-times'
          className='p-button-danger'
          onClick={() => onHide()}
        />
        <Button
          label='Detail'
          icon='pi pi-check'
          onClick={() => onSubmit()}
          autoFocus
        />
      </div>
    );
  };

  const renderHeader = () => {
    return (
      <div className='flex justify-content-between'>
        <div className='table-header'>
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
      PSC: {
        operator: FilterOperator.AND,
        constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }],
      },
    });
    setGlobalFilterValue('');
  };

  const getPohlavie = () => {
    if (selectedRow !== null)
      return selectedRow.ROD_CISLO.substring(2, 3) === '5' ||
        selectedRow.ROD_CISLO.substring(2, 3) === '6'
        ? 'Žena'
        : 'Muž';
  };
  const getVek = () => {
    if (selectedRow != null) {
      let birthDate =
        '19' +
        selectedRow.ROD_CISLO.substring(0, 2) +
        '-' +
        (selectedRow.ROD_CISLO.substring(2, 4) % 50) +
        '-' +
        selectedRow.ROD_CISLO.substring(4, 6);

      birthDate = new Date(birthDate);

      var today = new Date();
      return getDifferenceInDays(today, birthDate);
    }
  };

  const getDifferenceInDays = (date1, date2) => {
    const diffInMs = Math.abs(date2 - date1);
    return Math.round(diffInMs / (1000 * 60 * 60 * 24) / 365);
  };

  const header = renderHeader();
  return (
    <div>
      <Toast ref={toast} position='top-center' />
      <div className='card'>
        <DataTable
          value={pacienti}
          responsiveLayout='scroll'
          selectionMode='single'
          paginator
          rows={15}
          selection={selectedRow}
          onSelectionChange={(e) => handleClick(e.value)}
          header={header}
          filters={filters}
          filterDisplay='menu'
          globalFilterFields={['ROD_CISLO', 'MENO', 'PRIEZVISKO', 'PSC']}
          emptyMessage='Žiadne výsledky nevyhovujú vyhľadávaniu'
        >
          <Column field='ROD_CISLO' header={'Rodné číslo'} filter></Column>
          <Column field='MENO' header={'Meno'} filter></Column>
          <Column field='PRIEZVISKO' header={'Priezvisko'} filter></Column>
          <Column field='PSC' header={'PSČ'} filter></Column>
        </DataTable>
      </div>
      <Dialog
        header={
          selectedRow != null
            ? selectedRow.MENO + ' ' + selectedRow.PRIEZVISKO
            : ''
        }
        visible={showDialog}
        style={{ width: '50vw' }}
        footer={renderDialogFooter()}
        onHide={() => onHide()}
      >
        <p>{getPohlavie()}</p>
        <p>{getVek() + ' rokov'}</p>
        <p>{selectedRow != null ? 'PSČ ' + selectedRow.PSC : ''}</p>
      </Dialog>
    </div>
  );
}
