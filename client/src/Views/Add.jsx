import React, { useState, useRef, useEffect } from 'react';
import { Calendar } from 'primereact/calendar';
import { InputText } from 'primereact/inputtext';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { SelectButton } from 'primereact/selectbutton';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Toast } from 'primereact/toast';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { AutoComplete } from 'primereact/autocomplete';
export default function Add() {
  const toast = useRef(null);
  const fileUploader = useRef(null);
  const [eventDateStart, setEventDateStart] = useState(null);
  const [base64Data, setBase64Data] = useState(null);
  const [currRodCislo, setCurrRodCislo] = useState(null);
  const [patientName, setPatientName] = useState(null);
  const [patientSurname, setPatientSurname] = useState(null);
  const [patientPhone, setPatientPhone] = useState(null);
  const [patientMail, setPatientMail] = useState(null);
  const [eventTypeButton, setEventTypeButton] = useState(1);
  const [placeId, setPlaceId] = useState(null);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [text, setText] = useState('');
  const [duration, setDuration] = useState(null);
  const [eventDateEnd, setEventDateEnd] = useState(null);
  const [cities, setCities] = useState([]);
  const [selectedPsc, setSelectedPsc] = useState(null);
  const [filteredPsc, setFilteredPsc] = useState(null);
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

  useEffect(() => {
    fetch('/add/psc')
      .then((response) => response.json())
      .then((res) => {
        console.log(res);
        let array = [];
        array = res.map((item) => item);
        console.log(array[0].name);
        setCities(array);
      });
  }, []); // eslint-disable-line;

  const onPlaceIdChange = (e) => {
    setPlaceId(e.value);
  };

  const handleClick = () => {
    setButtonLoading(true);
    insertData();
  };

  async function insertData() {
    switch (eventTypeButton) {
      case 1:
        handleUploadRecords('operacia');
        break;
      case 2:
        handleUploadRecords('vysetrenie');

        break;
      case 3:
        handleUploadRecords('hospitalizacia');
        break;
      case 4:
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
        break;
      case 5:
        const requestOptionsPatient = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            rod_cislo: currRodCislo,
            meno: patientName,
            priezvisko: patientSurname,
            psc: selectedPsc.name,
            telefon: patientPhone,
            email: patientMail,
            id_poistenca: null,
            id_typu_krvnej_skupiny: 1,
            id_lekara: 1,
          }),
        };
        const responsePatient = await fetch(
          '/add/pacient',
          requestOptionsPatient
        ).then(() => setButtonLoading(false));
        console.log(responsePatient);
        break;
      default:
        break;
    }
  }

  async function handleUploadRecords(recordsName) {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        rod_cislo: currRodCislo,
        datum: eventDateStart.toLocaleString('en-GB').replace(',', ''),
        id_lekara: 1,
        popis: text,
        priloha: base64Data,
        trvanie: duration,
        id_miestnosti: 20,
        datum_do:
          eventDateEnd !== null
            ? eventDateEnd.toLocaleString('en-GB').replace(',', '')
            : null,
      }),
    };
    const response = await fetch(`/add/${recordsName}`, requestOptions).then(
      () => {
        setButtonLoading(false);
        setSelectedPsc(null);
        setCurrRodCislo(null);
        setEventDateStart(null);
        fileUploader.current.clear();
        setText('');
        setPatientName(null);
        setPatientSurname(null);
        setPatientPhone(null);
        setPatientMail(null);
        setDuration(null);
        setEventDateEnd(null);
      }
    );
    console.log(response);
  }

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBase64Data(reader.result.substring(reader.result.indexOf(',') + 1));
      console.log(reader.result);
    };
  };

  const renderAddPatientContent = () => {
    return (
      <>
        <div className='field col-12'>
          <label htmlFor='basic'>Meno</label>
          <InputText
            value={patientName !== null ? patientName : ''}
            className={patientName !== null ? '' : 'p-invalid'}
            onChange={(e) => setPatientName(e.target.value)}
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Priezvisko</label>
          <InputText
            value={patientSurname !== null ? patientSurname : ''}
            className={patientSurname !== null ? '' : 'p-invalid'}
            onChange={(e) => setPatientSurname(e.target.value)}
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Rodné číslo</label>
          <InputMask
            value={currRodCislo !== null ? currRodCislo : ''}
            onChange={(e) => setCurrRodCislo(e.target.value)}
            mask='999999/9999'
            className={
              currRodCislo !== null && currRodCislo.length === 11
                ? ''
                : 'p-invalid'
            }
            placeholder='900101/0101'
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>PSČ</label>
          <AutoComplete
            value={selectedPsc}
            suggestions={filteredPsc}
            completeMethod={searchPsc}
            field='name'
            className={selectedPsc !== null ? '' : 'p-invalid'}
            onChange={(e) => setSelectedPsc(e.value)}
          />
        </div>
        <div className='field col-12'>
          <label htmlFor='basic'>Telefón</label>
          <InputMask
            value={patientPhone !== null ? patientPhone : ''}
            onChange={(e) => setPatientPhone(e.target.value)}
            mask='+421999999999'
            className={
              patientPhone !== null && patientPhone.length === 13
                ? ''
                : 'p-invalid'
            }
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

  const searchPsc = (event) => {
    setTimeout(() => {
      let _filteredPsc;
      if (!event.query.trim().length) {
        _filteredPsc = [...cities];
      } else {
        _filteredPsc = cities.filter((city) => {
          return city.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredPsc(_filteredPsc);
    }, 250);
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

  const isNotCompleted = () => {
    switch (eventTypeButton) {
      case 1:
        if (
          currRodCislo === null ||
          eventDateStart === null ||
          text === '' ||
          duration === null ||
          placeId === null
        ) {
          console.log('first');
          return true;
        } else {
          return false;
        }
      default:
        return false;
    }
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
              className={
                currRodCislo !== null && currRodCislo.length === 11
                  ? ''
                  : 'p-invalid'
              }
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
              className={eventDateStart !== null ? '' : 'p-invalid'}
              showIcon
              dateFormat='dd.mm.yy'
            />
          </div>
          {eventTypeButton === 4 ? (
            <div className='field col-12 '>
              <label htmlFor='basic'>Id lieku</label>
              <Dropdown
                value={placeId}
                className={placeId !== null ? '' : 'p-invalid'}
                options={placesId}
                onChange={onPlaceIdChange}
                optionLabel='id'
              />
            </div>
          ) : (
            <>
              <div className='field col-12 '>
                <label htmlFor='basic'>Popis</label>
                <InputTextarea
                  rows={5}
                  cols={30}
                  value={text}
                  autoResize
                  className={text !== '' ? '' : 'p-invalid'}
                  onChange={(e) => setText(e.target.value)}
                />
              </div>
              {eventTypeButton === 1 ? (
                <>
                  <div className='field col-12 '>
                    <label htmlFor='basic'>Trvanie v minútach</label>
                    <InputNumber
                      value={duration}
                      placeholder='60'
                      className={duration !== null ? '' : 'p-invalid'}
                      onChange={(e) => setDuration(e.value)}
                    />
                  </div>
                  <div className='field col-12 '>
                    <label htmlFor='basic'>Miestnosť</label>
                    <Dropdown
                      value={placeId}
                      options={placesId}
                      className={placeId !== null ? '' : 'p-invalid'}
                      onChange={onPlaceIdChange}
                      optionLabel='id'
                    />
                  </div>
                </>
              ) : eventTypeButton === 3 ? (
                <div className='field col-12 '>
                  <label htmlFor='basic'>Dátum ukončenia</label>
                  <Calendar
                    id='basic'
                    value={eventDateEnd}
                    onChange={(e) => setEventDateEnd(e.value)}
                    showTime
                    className={eventDateEnd !== null ? '' : 'p-invalid'}
                    showIcon
                    dateFormat='dd.mm.yy'
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
                  onSelect={customBase64Uploader}
                  uploadHandler={customBase64Uploader}
                  emptyTemplate={
                    <p className='m-0'>
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
              </div>
            </>
          )}
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
          disabled={isNotCompleted()}
        />
      </div>
    </div>
  );
}
