import React, { useState, useRef } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
export default function Add() {
  const toast = useRef(null);
  const fileUploader = useRef(null);
  const [eventDateStart, setEventDateStart] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [currRodCislo, setCurrRodCislo] = useState(null);
  const [patientName, setPatientName] = useState('');
  const [patientSurname, setPatientSurname] = useState('');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientMail, setPatientMail] = useState('');
  const [currPsc, setCurrPsc] = useState(null);
  const [eventTypeButton, setEventTypeButton] = useState(1);
  const [placeId, setPlaceId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const eventTypes = [
    { name: 'Operácia', code: 'OP', value: 1 },
    { name: 'Vyšetrenie', code: 'EX', value: 2 },
    { name: 'Hospitalizácia', code: 'HOSP', value: 3 },
    { name: 'Recept', code: 'RECEPT', value: 4 },
    { name: 'Pacient', code: 'PAT', value: 5 },
  ];
  const placesId = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  const onPlaceIdChange = (e) => {
    setPlaceId(e.value);
  };

  const handleClick = () => {
    setButtonLoading(true);
    insertData();
  };

  async function insertData() {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rod_cislo: currRodCislo,
        datum: eventDateStart.toLocaleString('en-GB').replace(',', ''),
        id_lekara: 1,
        id_lieku: placeId.id,
        datum_vyzdvihnutia: null,
      }),
    };
    const response = await fetch('/add/recept', requestOptions);
    console.log(response);
    const requestOptionsForFile = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: base64Data,
      }),
    };
    fetch('/add/priloha', requestOptionsForFile)
      .then((response) => response.blob())
      .then((res) => {
        setButtonLoading(false);
        console.log(fileUploader.current.clear());
        toast.current.show({
          severity: 'success',
          summary: 'Úspešné odoslanie',
          detail: 'Dáta sa podarilo úspešne odoslať',
          life: 3000,
        });
      });
  }

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBase64Data(reader.result.substring(reader.result.indexOf(',') + 1));
    };
  };

  const renderAddPatientContent = () => {
    return (
      <>
        <div className='field col-12'>
          <label htmlFor='basic'>Meno</label>
          <InputText
            value={patientName !== null ? patientName : ''}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Priezvisko</label>
          <InputText
            value={patientSurname !== null ? patientSurname : ''}
            onChange={(e) => setPatientSurname(e.target.value)}
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Rodné číslo</label>
          <InputMask
            value={currRodCislo !== null ? currRodCislo : ''}
            onChange={(e) => setCurrRodCislo(e.target.value)}
            mask='999999/9999'
            placeholder='900101/0101'
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>PSČ</label>
          <InputMask
            value={currPsc !== null ? currPsc : ''}
            onChange={(e) => setCurrPsc(e.target.value)}
            mask='99999'
            placeholder='99999'
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Telefón</label>
          <InputMask
            value={patientPhone !== null ? patientPhone : ''}
            onChange={(e) => setPatientPhone(e.target.value)}
            mask='+421999999999'
            placeholder='+421919121121'
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>E-mail</label>
          <InputText
            value={patientMail !== null ? patientMail : ''}
            onChange={(e) => setPatientMail(e.target.value)}
            pattern=' /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i'
          />
        </div>
      </>
    );
  };

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: 'transparent',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  return (
    <div
      style={{ width: '90%', marginTop: '2rem' }}
      className='p-fluid grid formgrid'
    >
      <Toast ref={toast} />
      <div className='field col-12'>
        <SelectButton
          value={eventTypeButton}
          options={eventTypes}
          onChange={(e) => setEventTypeButton(e.value)}
          optionLabel='name'
        />
      </div>
      {eventTypeButton === 5 ? (
        renderAddPatientContent()
      ) : (
        <>
          <div className='field col-12'>
            <label htmlFor='basic'>Rodné číslo</label>
            <InputMask
              value={currRodCislo !== null ? currRodCislo : ''}
              onChange={(e) => setCurrRodCislo(e.target.value)}
              mask='999999/9999'
              placeholder='900101/0101'
            />
          </div>
          <div className='field col-12 '>
            <label htmlFor='basic'>Dátum</label>
            <Calendar
              id='basic'
              value={eventDateStart}
              onChange={(e) => setEventDateStart(e.value)}
              showTime
              showIcon
              dateFormat='dd.mm.yy'
            />
          </div>
          {eventTypeButton === 4 ? (
            <div className='field col-12 '>
              <label htmlFor='basic'>Id lieku</label>
              <Dropdown
                value={placeId}
                options={placesId}
                onChange={onPlaceIdChange}
                optionLabel='id'
              />
            </div>
          ) : (
            ''
          )}
          <div className='field col-12 '>
            <label htmlFor='basic'>Príloha</label>
            <FileUpload
              ref={fileUploader}
              mode='advanced'
              accept='image/*'
              customUpload
              chooseLabel='Vložiť'
              cancelLabel='Zrušiť'
              headerTemplate={headerTemplate}
              maxFileSize={50000000}
              uploadHandler={customBase64Uploader}
              emptyTemplate={
                <p className='m-0'>Drag and drop files to here to upload.</p>
              }
            />
          </div>
        </>
      )}
      <div
        className='field col-12 '
        style={{ justifyContent: 'center', display: 'grid' }}
      >
        <Button
          style={{ width: '50vh' }}
          className='p-button-lg'
          label='Submit'
          icon='pi pi-check'
          loading={buttonLoading}
          onClick={handleClick}
          iconPos='right'
        />
      </div>
    </div>
  );
}
