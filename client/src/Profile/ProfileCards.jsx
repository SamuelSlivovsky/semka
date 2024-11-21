import React, { useEffect, useRef, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { useLocation } from 'react-router';
import { Dialog } from 'primereact/dialog';
import HospitForm from '../Forms/HospitForm';
import RecipeForm from '../Forms/RecipeForm';
import OperationForm from '../Forms/OperationForm';
import ExaminationForm from '../Forms/ExaminationForm';
import TableMedicalRecords from '../Views/Tables/TableMedicalRecords';
import '../icons.css';
import DiseaseForm from '../Forms/DiseaseForm';
import DisablesForm from '../Forms/DisablesForm';
import VacForm from '../Forms/VacForm';
import { Tag } from 'primereact/tag';
import { Calendar } from 'primereact/calendar';
import { Toast } from 'primereact/toast';

export default function ProfileCard(props) {
  const toast = useRef(null);
  const [profile, setProfile] = useState('');
  const [show, setShow] = useState(false);
  const location = useLocation();
  const [eventType, setEventType] = useState('');
  const [header, setHeader] = useState('');
  const [showDisables, setShowDisables] = useState(false);
  const [showVac, setShowVac] = useState(false);
  const [patientMedicalRecords, setPatientMedicalRecords] = useState('');
  const [patientRecipes, setPatientRecipes] = useState('');
  const [patientDiseases, setPatientDiseases] = useState('');
  const [patientZTPTypes, setPatientZTPTypes] = useState([]);
  const [patientVac, setPatientVac] = useState([]);
  const [allowUpdateTimeOfDeath, setAllowUpdateTimeOfDeath] = useState(false);
  const token = localStorage.getItem('hospit-user');
  const headers = { authorization: 'Bearer ' + token };

  const medicalRecordsTable = {
    tableName: 'Zdravotné záznamy',
    route: '/pacient',
    cellData: patientMedicalRecords,
    titles: [
      { field: 'DATUM', header: 'Dátum' },
      { field: 'TYP', header: 'Typ záznamu' },
      { field: 'DAT_DO', header: 'Dátum do' },
    ],
    allowFilters: false,
    dialog: true,
    tableScrollHeight: '480px',
    editor: false,
  };

  const recipesTable = {
    tableName: 'Predpísané recepty',
    route: '/pacient',
    cellData: patientRecipes,

    titles: [
      { field: 'NAZOV', header: 'Názov' },
      { field: 'LEKAR', header: 'Lekár' },
      { field: 'DATUM_ZAPISU', header: 'Dátum zápisu' },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: '480px',
    editor: false,
  };

  const onEditDisableDate = (data) => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        datum_od: data.DAT_OD,
        datum_do: data.DAT_DO,
        id_pacienta:
          typeof props.patientId !== 'undefined' && props.patientId !== null
            ? props.patientId
            : location.state,
        id_postihnutia: data.ID_POSTIHNUTIA,
      }),
    };
    fetch('/api/update/ztp', requestOptions);
  };

  const onEditDiseaseDate = (data) => {
    const token = localStorage.getItem('hospit-user');
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        datum_od: data.DAT_OD,
        datum_do: data.DAT_DO,
        id_pacienta:
          typeof props.patientId !== 'undefined' && props.patientId !== null
            ? props.patientId
            : location.state,
      }),
    };
    fetch('/api/update/choroba', requestOptions);
  };

  const diseasesTable = {
    tableName: 'Choroby',
    route: '/pacient',
    cellData: patientDiseases,
    setCellData: setPatientDiseases,
    onEditDate: onEditDiseaseDate,
    titles: [
      { field: 'NAZOV', header: 'Názov choroby' },
      { field: 'TYP', header: 'Typ choroby' },
      { field: 'DAT_OD', header: 'Od' },
      { field: 'DAT_DO', header: 'Do' },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: '480px',
    editor: true,
  };

  const disablesTable = {
    tableName: 'Postihnutia',
    route: '/pacient',
    cellData: patientZTPTypes,
    setCellData: setPatientZTPTypes,
    onEditDate: onEditDisableDate,
    titles: [
      { field: 'NAZOV', header: 'Postihnutie' },
      { field: 'DAT_OD', header: 'Od' },
      { field: 'DAT_DO', header: 'Do' },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: '480px',
    editor: true,
  };

  const vacTable = {
    tableName: 'Očkovania',
    route: '/pacient',
    cellData: patientVac,
    setCellData: setPatientVac,
    titles: [
      { field: 'NAZOV', header: 'Očkovanie' },
      { field: 'TYP', header: 'Typ' },
      { field: 'DATUM', header: 'Dátum' },
    ],
    allowFilters: false,
    dialog: false,
    tableScrollHeight: '480px',
    editor: false,
  };

  const fetchPatientInfo = () => {
    fetch(
      `patient/info/${
        typeof props.patientId !== 'undefined' && props.patientId !== null
          ? props.patientId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setProfile(...data);
        console.log(data);
      });
  };

  const fetchRecipies = () => {
    fetch(
      `patient/recepty/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientRecipes(data);
      });
  };

  const fetchDiseases = () => {
    fetch(
      `patient/choroby/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientDiseases(data);
      });
  };

  const fetchDisables = () => {
    fetch(
      `patient/typyZTP/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientZTPTypes(data);
      });
  };

  const fetchMedRecords = () => {
    fetch(
      `patient/zdravZaznamy/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientMedicalRecords(data);
      });
  };

  const fetchVacs = () => {
    fetch(
      `patient/ockovania/${
        props.patientId !== null ? props.patientId : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setPatientVac(data);
      });
  };

  useEffect(() => {
    fetchPatientInfo();
    fetchDisables();
    fetchDiseases();
    fetchMedRecords();
    fetchRecipies();
    fetchVacs();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClick = (eventType) => {
    setEventType(eventType);
    switch (eventType) {
      case 'examination':
        setHeader('Vytvoriť nové vyšetrenie');
        break;
      case 'operation':
        setHeader('Vytvoriť novú operáciu');
        break;
      case 'hospit':
        setHeader('Vytvoriť novú hospitalizáciu');
        break;
      case 'vacci':
        setHeader('Vytvoriť nové očkovanie');
        break;
      case 'disease':
        setHeader('Pridať novú chorobu');
        break;
      case 'ZTP':
        setHeader('Pridať nové ZŤP');
        break;
      case 'recipe':
        setHeader('Pridať nový recept');
        break;
      default:
        break;
    }
    setShow(true);
  };

  const onHide = () => {
    setShow(false);
  };

  const renderDialog = () => {
    switch (eventType) {
      case 'examination':
        return (
          <ExaminationForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchMedRecords()}
          />
        );
      case 'operation':
        return (
          <OperationForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchMedRecords()}
          />
        );
      case 'hospit':
        return (
          <HospitForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchMedRecords()}
          />
        );
      case 'vacci':
        return (
          <VacForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchVacs()}
          ></VacForm>
        );
      case 'disease':
        return (
          <DiseaseForm
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchDiseases()}
          />
        );
      case 'ZTP':
        return (
          <DisablesForm
            patientId={
              props.patientId !== null ? props.patientId : location.state
            }
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchDisables()}
          />
        );
      case 'recipe':
        return (
          <RecipeForm
            patientId={
              props.patientId !== null ? props.patientId : location.state
            }
            rod_cislo={profile.ROD_CISLO}
            hideDialog={() => onHide()}
            onInsert={() => fetchDisables()}
          />
        );
      default:
        break;
    }
  };

  const updateTimeOfDeath = (e) => {
    if (e.value <= new Date()) {
      setProfile({ ...profile, DATUM_UMRTIA: e.value });
      const token = localStorage.getItem('hospit-user');
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          authorization: 'Bearer ' + token,
        },
        body: JSON.stringify({
          datum_umrtia: e.value.toLocaleString('en-GB').replace(',', ''),
          id_pacienta:
            typeof props.patientId !== 'undefined' && props.patientId !== null
              ? props.patientId
              : location.state,
        }),
      };
      fetch('/api/patient/update/umrtie', requestOptions);
    } else {
      toast.current.show({
        severity: 'error',
        summary: 'Dátum úmrtia nemôže byť v budúcnosti',
        life: 3000,
      });
    }
  };

  return (
    <div>
      <Toast ref={toast} />
      <div className='flex col-12 '>
        <Card
          className='col-5 shadow-4 '
          style={{ width: '50rem', height: '40rem' }}
          title={
            <div style={{ display: 'flex', gap: '10px' }}>
              {profile.MENO + ' ' + profile.PRIEZVISKO}{' '}
              {profile.CUDZINEC == 1 ? (
                <Tag
                  style={{ fontSize: '16px' }}
                  severity={'info'}
                  value={'Cudzinec'}
                />
              ) : (
                ''
              )}
            </div>
          }
        >
          <div className='flex '>
            <div className='col-6 text-center m-0'>
              <h4>Rok narodenia</h4>
              <div>{profile.DATUM_NARODENIA}</div>
            </div>
            <div className='col-6 text-center m-0'>
              <h4>Dátum úmrtia</h4>
              <div>
                {profile.DATUM_UMRTIA ? (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'center',
                    }}
                  >
                    {' '}
                    <Calendar
                      style={{ width: '170px' }}
                      showTime
                      value={new Date(profile.DATUM_UMRTIA)}
                      onChange={(e) => {
                        updateTimeOfDeath(e);
                      }}
                      disabled={!allowUpdateTimeOfDeath}
                    />
                    <Button
                      label='Uprav'
                      onClick={() => setAllowUpdateTimeOfDeath(true)}
                    />
                  </div>
                ) : (
                  <div
                    style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'center',
                    }}
                  >
                    <Calendar
                      value={
                        profile.DATUM_UMRTIA
                          ? new Date(profile.DATUM_UMRTIA)
                          : ''
                      }
                      onChange={(e) => {
                        updateTimeOfDeath(e);
                      }}
                      style={{
                        width: '170px',
                        display: allowUpdateTimeOfDeath ? '' : 'none',
                      }}
                      showTime
                    />
                    <Button
                      label='Pridaj'
                      onClick={() => setAllowUpdateTimeOfDeath(true)}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className='flex w-100'>
            <div className='col-6 text-center m-0'>
              <h4>Vek</h4>
              <div>{profile.VEK}</div>
            </div>
            <div className='col-6 text-center m-0'>
              <h4>Mobil</h4>
              <div>{profile.TEL}</div>
            </div>
          </div>

          <div className='flex'>
            <div className='col-6 text-center m-0'>
              <h4>Krvna skupina</h4>
              <div>{profile.TYP_KRVI}</div>
            </div>
            <div className='col-6 text-center m-0'>
              <h4>Poistovňa</h4>
              <div>{profile.NAZOV_POISTOVNE}</div>
            </div>
          </div>

          <div className='flex w-100'>
            <div className='col-6 text-center m-0'>
              <h4>Adresa</h4>
              <div>{profile.NAZOV_OBCE + ' ' + profile.PSC}</div>
            </div>
            <div className='col-6 text-center m-0'>
              <h4>ZŤP</h4>
              <div>
                {patientZTPTypes.length !== 0 ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '20px',
                    }}
                  >
                    {patientZTPTypes.find(
                      (item) => item.DAT_DO === 'Súčasnosť'
                    ) !== null
                      ? 'Áno'
                      : 'Nie '}
                    <Button
                      label='Zoznam'
                      onClick={() => setShowDisables(true)}
                    ></Button>
                  </div>
                ) : (
                  'Nie'
                )}
              </div>
            </div>
          </div>
          <div className='flex'>
            <div className='mt-5 text-center col-6 text-center m-0'>
              <Button label='Poslať správu' icon='pi pi-send' />
            </div>
            <div className='mt-5 text-center col-6 text-center m-0'>
              <Button
                label='Zoznam Očkovaní'
                icon='pi pi-list'
                onClick={() => setShowVac(true)}
              ></Button>
            </div>
          </div>
        </Card>

        <Card
          className='col-4 shadow-4'
          title='Predpísané recepty'
          style={{ width: '50rem', height: '40rem' }}
        >
          <TableMedicalRecords {...recipesTable} />
        </Card>
      </div>

      <div className='col-12 flex'>
        <Card
          className='col-5 shadow-4'
          title='Zdravotné záznamy'
          style={{ width: '50rem', height: '40rem' }}
        >
          <TableMedicalRecords {...medicalRecordsTable} />
        </Card>

        <Card
          className='col-5 shadow-4'
          title='Choroby'
          style={{ width: '50rem', height: '40rem' }}
        >
          <TableMedicalRecords {...diseasesTable} />
        </Card>
      </div>
      {props.userData.UserInfo.role === 0 ||
      props.userData.UserInfo.role === 1 ||
      props.userData.UserInfo.role === 2 ||
      props.userData.UserInfo.role === 3 ? (
        <>
          <div className='flex '>
            <div className='col-2 m-4'>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nové vyšetrenie'
                  icon='examination-icon'
                  onClick={() => handleClick('examination')}
                />
              </div>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nová operácia'
                  icon='operation-icon'
                  onClick={() => handleClick('operation')}
                />
              </div>
            </div>

            <div className='col-2 m-4'>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nová hospitalizácia'
                  icon='hospit-icon'
                  onClick={() => handleClick('hospit')}
                />
              </div>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nové očkovanie'
                  icon='vaccine-icon'
                  onClick={() => handleClick('vacci')}
                />
              </div>
            </div>

            <div className='col-2 m-4'>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nová choroba'
                  icon='disease-icon'
                  onClick={() => handleClick('disease')}
                />
              </div>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nové ZŤP'
                  icon='disabled-icon'
                  onClick={() => handleClick('ZTP')}
                />
              </div>
            </div>

            <div className='col-2 m-4'>
              <div className='p-3'>
                <Button
                  style={{ width: '100%' }}
                  label='Nový recept'
                  icon='recipe-icon'
                  onClick={() => handleClick('recipe')}
                />
              </div>
            </div>
          </div>
          <Dialog
            blockScroll
            visible={show}
            onHide={onHide}
            header={header}
            style={{ width: '800px' }}
          >
            {renderDialog()}
          </Dialog>
          <Dialog
            visible={showDisables}
            onHide={() => setShowDisables(false)}
            style={{ width: '1000px' }}
          >
            {' '}
            <TableMedicalRecords {...disablesTable} />
          </Dialog>
          <Dialog
            visible={showVac}
            onHide={() => setShowVac(false)}
            style={{ width: '1000px' }}
          >
            {' '}
            <TableMedicalRecords {...vacTable} />
          </Dialog>
        </>
      ) : (
        ''
      )}
    </div>
  );
}
