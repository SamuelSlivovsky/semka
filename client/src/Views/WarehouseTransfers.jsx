//@TODO add automatic transfer for expiring medications + when they are expired or there is large amount in main warehouse
//@TODO add new tab

import { TabPanel, TabView } from 'primereact/tabview';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import React, { useEffect, useRef, useState } from 'react';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import { Button } from 'primereact/button';
import GetUserData from '../Auth/GetUserData';
import { ProgressSpinner } from 'primereact/progressspinner';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import '../styles/warehouses.css';

export default function WarehouseTransfers() {
  let emptyTransfer = {
    ID_PRESUN: null,
    ID_SKLAD_OBJ: null,
    ID_SKLAD_PRIJ: null,
    DATUM_PRESUNU: null,
    ZOZNAM_LIEKOV: null,
    STATUS: null,
  };

  let dialog = {
    dialog: true,
  };

  let emptyHospital = {
    NAZOV: null,
    ID_NEMOCNICE: null,
  };

  //Constants
  const toast = useRef(null);
  const [inputValues, setInputValues] = useState({});
  const [hospitalSearchOption, setHospitalSearchOption] = useState(false);
  const [medicineSearchOption, setMedicineSearchOption] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [selectedHospital, setSelectedHospital] = useState(emptyHospital);
  const [showNewTransfer, setShowNewTransfer] = useState(false);
  const [waitingTransfers, setWaitingTransfers] = useState(null);
  const [finishedTransfers, setFinishedTransfers] = useState(null);
  const [hospitals, setHospitals] = useState([]);
  const [medications, setMedications] = useState(null);
  const [hospitalMedications, setHospitalMedication] = useState(null);
  const [selectedRow, setSelectedRow] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [showHospitalMedications, setShowHospitalMedications] = useState(false);
  const [showHospitalSelection, setShowHospitalSelection] = useState(false);
  const [xmlContent, setXmlContent] = useState('');

  const dropdownOptions = [
    { value: 'hospital', label: 'Vyhľadať podľa nemocnice' },
    { value: 'medicine', label: 'Vyhľadať podľa liekov' },
  ];

  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const userDataHelper = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };

    //Finished transfers
    fetch(`presuny/allFin`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setFinishedTransfers(data);
      });

    //Waiting transfers
    fetch(`presuny/allWait`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setWaitingTransfers(data);
      });
  }, []);

  /*
    ----------------------------------------------------------------------------------------
    Functions section
    ----------------------------------------------------------------------------------------
    */

  //Function for openning list of medication that are in JSON format
  const handleClick = (value) => {
    setShowDialog(true);
    setLoading(true);
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    setSelectedRow(value);

    fetch(`/api/presuny/list/${value.ID_PRESUN}`, { headers })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }

        return res.text();
      })
      .then((data) => {
        try {
          const jsonData = JSON.parse(data);

          // If ZOZNAM_LIEKOV is a string, parse it as JSON
          if (jsonData && jsonData[0] && jsonData[0].ZOZNAM_LIEKOV) {
            const zoznamLiekovArray = JSON.parse(jsonData[0].ZOZNAM_LIEKOV);

            // Now zoznamLiekovArray should be an array of objects
            //console.log('Parsed ZOZNAM_LIEKOV:', zoznamLiekovArray);

            setLoading(false);
            setXmlContent(zoznamLiekovArray);
          } else {
            console.error('Invalid ZOZNAM_LIEKOV structure:', jsonData);
          }
        } catch (error) {
          console.error('Error parsing data:', error);
        }
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };

  //Function for just openning Dialog menu
  const openNewTransfer = () => {
    setShowNewTransfer(true);
  };

  //Function for getting all hospitals from DB into Dropdown
  const getHospitalsList = () => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/presuny/getWarehouses`, { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHospitals(data);
      });
  };

  //Function for searching all medications that are in table medicine
  //@TODO select needs to be checked, there is some error in searching by hospital
  const getMedicationList = () => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    /*fetch(`presuny/hospitalMedications/${selectedHospital}`, {headers})
            .then((response) => response.json())
            .then((data) => {
                setHospitalMedication(data);
            });*/
  };

  const createHospitalTransfer = () => {
    setShowHospitalMedications(false);
  };

  //Function for searching medication in selected hospital
  const searchHospitalMedicine = () => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch(`presuny/hospitalMedications/${selectedHospital.ID_NEMOCNICE}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setHospitalMedication(data);
      });
    //@TODO change visibality of previoud DIALOG and show new table for this with all medications
  };

  //Function for updating
  const handleDropdownChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedOption(selectedValue);
    if (selectedValue === 'hospital') {
      setHospitalSearchOption(true);
      setMedicineSearchOption(false);
      if (hospitals.length <= null) {
        getHospitalsList();
      }
    } else if (selectedValue === 'medicine') {
      setMedicineSearchOption(true);
      setHospitalSearchOption(false);
      if (medications == null) {
        getMedicationList();
      }
    }
  };

  //Search function for searching medication
  const searchMedication = () => {
    //If user selected hospital then search by selected hospital
    if (selectedOption === 'hospital') {
      if (selectedHospital !== null) {
        searchHospitalMedicine();
        setShowHospitalMedications(true);
        hideDialog();
      } else {
        //@TODO Add alert in here
      }
    } else {
      //@TODO add check if array is atleast of size 1, if not alert
    }
  };

  //Function for checking number in Požadovaný počet, there should be only numbers and not greater then Počet
  const handleInputChange = (event, rowData) => {
    const { value } = event.target;
    const { ID_LIEK, POCET } = rowData;
    const numericValue = Math.min(
      parseInt(value.replace(/\D/g, ''), 10),
      POCET
    );
    setInputValues((prevState) => ({
      ...prevState,
      [ID_LIEK]: numericValue,
    }));
  };

  //@TODO needs to be changed to suit this site
  //New/Delete toolbar function
  const leftToolbarTemplate = () => {
    return (
      <React.Fragment>
        <Button
          label='Hľadať lieky'
          icon='pi pi-plus'
          className='p-button-success mr-2'
          onClick={openNewTransfer}
        />
        <Button
          visible={showHospitalMedications}
          label='Vytvoriť presun'
          icon='pi pi-check-square'
          className='p-button-success mr-2'
          onClick={createHospitalTransfer}
        />
      </React.Fragment>
    );
  };

  const productDialogFooter = (
    <React.Fragment>
      <Button
        label='Cancel'
        icon='pi pi-times'
        className='p-button-text'
        onClick={NaN} //hideDialog
      />
      <Button
        label='Save'
        icon='pi pi-check-square'
        className='p-button-text'
        onClick={NaN} //addOrder
      />
    </React.Fragment>
  );

  /*
    ******************************************************************************************************************
                                                    Hide functions
    ******************************************************************************************************************
    */

  //Selected Order hide
  const onHide = () => {
    setXmlContent(null);
    setShowDialog(false);
    setSelectedRow(null);
  };

  //New order hide
  const hideDialog = () => {
    setShowNewTransfer(false);
    setShowHospitalSelection(false);
  };

  return (
    <div>
      <Toast ref={toast} />

      <Toolbar className='mb-4' left={leftToolbarTemplate}></Toolbar>

      {showHospitalMedications ? (
        <div>
          <DataTable
            value={hospitalMedications}
            dataKey='ID_LIEK'
            paginator={true}
            paginatorTemplate='CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown'
            currentPageReportTemplate='Zobrazuje sa {first} - {last} z celkových {totalRecords} záznamov'
            rowsPerPageOptions={[10, 15, 20]}
          >
            <Column
              field='ID_LIEK'
              header='Id lieku'
              style={{ minWidth: '8rem' }}
            ></Column>
            <Column
              field='NAZOV'
              header='Názov lieku'
              style={{ minWidth: '16rem' }}
            ></Column>
            <Column
              field='DATUM_TRVANLIVOSTI'
              header='Dátum trvanlivosti'
              style={{ minWidth: '12rem' }}
            ></Column>
            <Column
              field='POCET'
              header='Voľný počet na sklade'
              style={{ minWidth: '12rem' }}
            ></Column>
            <Column
              field='Input'
              header='Požadovaný počet'
              style={{ minWidth: '10rem' }}
              body={(rowData) => (
                <input
                  type='text'
                  defaultValue={inputValues[rowData.ID_LIEK] || '0'}
                  onChange={(e) => handleInputChange(e, rowData)}
                  pattern='[0-9]*'
                  inputMode='numeric'
                />
              )}
            ></Column>
          </DataTable>
        </div>
      ) : null}

      <TabView>
        //Tab for pending orders
        <TabPanel header='Čakajúce objednávky'>
          <DataTable
            value={waitingTransfers}
            selection={selectedRow}
            selectionMode='single'
            onSelectionChange={(e) => (dialog ? handleClick(e.value) : '')}
            dataKey='ID_LIEK'
            globalFilter={NaN} //globalFilter
            globalFilterFields={[
              'ID_PRESUN',
              'ID_SKLAD_OBJ',
              'ID_SKLAD_PRIJ',
              'DATUM_PRESUNU',
            ]}
            filters={NaN} //filter
            header={NaN} //header
            responsiveLayout='scroll'
          >
            <Column
              field='ID_PRESUN'
              header='Id presunu'
              style={{ minWidth: '8rem' }}
            ></Column>
            <Column
              field='ID_SKLAD_OBJ'
              header='Id objednávajúceho skladu'
              style={{ minWidth: '16rem' }}
            ></Column>
            <Column
              field='ID_SKLAD_PRIJ'
              header='Id prijímajúceho skladu'
              style={{ minWidth: '14rem' }}
            ></Column>
            <Column
              field='DATUM_PRESUNU'
              header='Dátum presunu'
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='STATUS'
              header='Status presunu'
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              body={NaN} //actionBodyTemplate
              style={{ minWidth: '8rem' }}
            ></Column>
          </DataTable>
        </TabPanel>
        //Tab for finished orders
        <TabPanel header='Vybavené objednávky'>
          <DataTable
            value={finishedTransfers}
            selection={selectedRow}
            selectionMode='single'
            onSelectionChange={(e) => (dialog ? handleClick(e.value) : '')}
            dataKey='ID_LIEK'
            globalFilter={NaN} //globalFilter
            globalFilterFields={[
              '',
              'ID_SKLAD_OBJ',
              'ID_SKLAD_PRIJ',
              'DATUM_PRESUNU',
            ]}
            filters={NaN} //filter
            header={NaN} //header
            responsiveLayout='scroll'
          >
            <Column
              field='ID_PRESUN'
              header='Id presunu'
              style={{ minWidth: '8rem' }}
            ></Column>
            <Column
              field='ID_SKLAD_OBJ'
              header='Id objednávajúceho skladu'
              style={{ minWidth: '16rem' }}
            ></Column>
            <Column
              field='ID_SKLAD_PRIJ'
              header='Id prijímajúceho skladu'
              style={{ minWidth: '14rem' }}
            ></Column>
            <Column
              field='DATUM_PRESUNU'
              header='Dátum presunu'
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              field='STATUS'
              header='Status presunu'
              style={{ minWidth: '10rem' }}
            ></Column>
            <Column
              body={NaN} //actionBodyTemplate
              style={{ minWidth: '8rem' }}
            ></Column>
          </DataTable>
        </TabPanel>
      </TabView>

      <Dialog
        visible={showDialog && dialog}
        style={{ width: '50vw' }}
        footer={NaN} //productDialogFooter
        onHide={() => onHide()}
      >
        {loading ? (
          <div style={{ width: '100%', display: 'flex' }}>
            <ProgressSpinner />
          </div>
        ) : selectedRow !== null ? (
          <div style={{ maxWidth: '100%', overflowWrap: 'break-word' }}>
            <h3>Zoznam objednaných liekov</h3>
            {xmlContent.map((item, index) => (
              <div key={index}>
                <p>Názov: {item.name}</p>
                <p>Počet: {item.amount}</p>
              </div>
            ))}
          </div>
        ) : (
          ''
        )}
      </Dialog>

      <Dialog
        visible={showNewTransfer}
        style={{ width: '500px' }}
        header='Pridať objednávku'
        modal
        className='p-fluid'
        //footer={productDialogFooter}
        onHide={hideDialog}
      >
        <Dropdown
          value={selectedOption}
          options={dropdownOptions}
          onChange={handleDropdownChange}
        />
        {hospitalSearchOption ? (
          <div>
            <h2>Vyberte si nemocnicu</h2>
            <Dropdown
              value={selectedHospital}
              options={hospitals.map((hospital) => ({
                value: hospital,
                label: hospital.NAZOV,
              }))}
              onChange={(selectedOption) => {
                setSelectedHospital(selectedOption.value);
              }}
            />
          </div>
        ) : null}

        {medicineSearchOption ? (
          <div>
            <h2>Vyberte si nemocnicu</h2>
          </div>
        ) : null}
        {hospitalSearchOption || medicineSearchOption ? (
          <div className={'submit-button'}>
            <Button
              style={{ width: '50%' }}
              label='Vyhľadať'
              onClick={searchMedication}
            />
          </div>
        ) : null}
      </Dialog>
    </div>
  );
}
