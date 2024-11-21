import React, { useState, useEffect } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { AutoComplete } from 'primereact/autocomplete';
import { Calendar } from 'primereact/calendar';
import GetUserData from '../Auth/GetUserData';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputText } from 'primereact/inputtext';
export default function MeetingForm() {
  const [showMessage, setShowMessage] = useState(false);
  const [zaznamy, setZaznamy] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [filteredZaznamy, setFilteredZaznamy] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    getZaznamy();
    getDoctors();
  }, []); // eslint-disable-line;

  const validate = (data) => {
    let errors = {};

    if (!data.datum) {
      errors.datum = 'Dátum je povinný';
    }
    if (!data.zaznam) {
      errors.zaznam = 'Záznam je povinný';
    }

    if (!data.lekari) {
      errors.lekari = 'Lekári sú povinní';
    }

    if (!data.popis) {
      errors.popis = 'Popis je povinný';
    }
    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('hospit-user');
    const userData = GetUserData(token);
    const requestOptionsMeeting = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },

      body: JSON.stringify({
        datum: data.datum.toLocaleString('en-GB').replace(',', ''),
        id_zaznamu: data.zaznam.ID_ZAZNAMU,
        sprava: data.sprava,
        popis: data.popis,
      }),
    };
    await fetch('/api/add/konzilium', requestOptionsMeeting).then(() =>
      setShowMessage(true)
    );

    const requestOptionsDoctorMeeting = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        lekari: [
          userData.UserInfo.userid,
          ...data.lekari.map((item) => item.CISLO_ZAM),
        ],
        id_zaznamu: data.zaznam.ID_ZAZNAMU,
      }),
    };
    await fetch('/api/add/konzilium/user', requestOptionsDoctorMeeting).then(
      () => setShowMessage(true)
    );

    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className='p-error'>{meta.error}</small>
    );
  };

  const dialogFooter = (
    <div className='flex justify-content-center'>
      <Button
        label='OK'
        className='p-button-text'
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );

  const getZaznamy = () => {
    const token = localStorage.getItem('hospit-user');
    const userData = GetUserData(token);
    const headers = { authorization: 'Bearer ' + token };
    fetch(`/api/lekar/zaznamy/${userData.UserInfo.userid}`, { headers })
      .then((response) => response.json())
      .then((res) => {
        setZaznamy(res);
      });
  };

  const getDoctors = () => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };
    fetch('/api/selects/zoznamLekarov', { headers })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      });
  };

  const searchZaznamy = (event) => {
    setTimeout(() => {
      let _filtered;
      if (!event.query.trim().length) {
        _filtered = [...zaznamy];
      } else {
        _filtered = zaznamy.filter((zaznam) => {
          return zaznam.NAZOV.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      setFilteredZaznamy(_filtered);
    }, 250);
  };

  const searchDoctors = (event) => {
    setTimeout(() => {
      let _filtered;
      if (!event.query.trim().length) {
        _filtered = [...doctors];
      } else {
        _filtered = doctors.filter((zaznam) => {
          return zaznam.meno.toLowerCase().includes(event.query.toLowerCase());
        });
      }

      setFilteredDoctors(_filtered);
    }, 250);
  };

  return (
    <div
      style={{ width: '100%', marginTop: '2rem', marginLeft: '10px' }}
      className='p-fluid grid formgrid'
    >
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position='top'
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className='flex align-items-center flex-column pt-6 px-3'>
          <i
            className='pi pi-check-circle'
            style={{ fontSize: '5rem', color: 'var(--green-500)' }}
          ></i>
          <h5>Úspešné odoslanie údajov</h5>
        </div>
      </Dialog>

      <div className='field col-12'>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            datum: '',
            popis: '',
            sprava: '',
            zaznam: null,
            lekari: null,
          }}
          validate={validate}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit} className='p-fluid'>
              <Field
                name='popis'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='popis'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Popis*
                    </label>
                    <InputText
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='datum'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='datum'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Dátum*
                    </label>
                    <Calendar
                      id='datum'
                      {...input}
                      showTime
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />

                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='zaznam'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='zaznam'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Zdravotný záznam*
                    </label>
                    <AutoComplete
                      {...input}
                      suggestions={filteredZaznamy}
                      completeMethod={searchZaznamy}
                      field='NAZOV'
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='lekari'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='lekari'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Lekári*
                    </label>
                    <AutoComplete
                      {...input}
                      suggestions={filteredDoctors}
                      multiple
                      completeMethod={searchDoctors}
                      field='meno'
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='sprava'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label
                      htmlFor='sprava'
                      className={classNames({
                        'p-error': isFormFieldValid(meta),
                      })}
                    >
                      Záverečná správa
                    </label>
                    <InputTextarea
                      id='sprava'
                      {...input}
                      className={classNames({
                        'p-invalid': isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <div
                className='field col-12 '
                style={{ justifyContent: 'center', display: 'grid' }}
              >
                <Button
                  type='submit'
                  style={{ width: '50vh' }}
                  className='p-button-lg'
                  label='Odoslať'
                  icon='pi pi-check'
                  iconPos='right'
                />
              </div>
            </form>
          )}
        />
      </div>
    </div>
  );
}
