import React, { useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputMask } from 'primereact/inputmask';
import { classNames } from 'primereact/utils';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import GetUserData from '../Auth/GetUserData';
export default function RecipeForm() {
  const [showMessage, setShowMessage] = useState(false);
  const drugs = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
  ];

  const validate = (data) => {
    let errors = {};

    if (!data.rod_cislo) {
      errors.rod_cislo = 'Rodné číslo je povinné';
    }
    if (!data.datum) {
      errors.datum = 'Dátum je povinný';
    }
    if (!data.id_lieku) {
      errors.id_lieku = 'Liek je povinný';
    }
    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('hospit-user');
    const userData = GetUserData(token);
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        rod_cislo: data.rod_cislo,
        datum: data.datum.toLocaleString('en-GB').replace(',', ''),
        id_lieku: data.id_lieku.id,
        id_lekara: userData.UserInfo.userid,
        datum_vyzdvihnutia: null,
      }),
    };
    const response = await fetch('/add/recept', requestOptions).then(() =>
      setShowMessage(true)
    );
    console.log(response);

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
  return (
    <div
      style={{ width: '100%', marginTop: '2rem' }}
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
          <h5>Úspešné vytvorenie receptu</h5>
        </div>
      </Dialog>

      <div className='field col-12'>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            rod_cislo: '',
            datum: null,
            id_lieku: null,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className='p-fluid'>
              <Field
                name='rod_cislo'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <span className='p-float-label'>
                      <InputMask
                        id='rod_cislo'
                        mask='999999/9999'
                        {...input}
                        className={classNames({
                          'p-invalid': isFormFieldValid(meta),
                        })}
                      />
                      <label
                        htmlFor='rod_cislo'
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Rodné číslo*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <Field
                name='datum'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <span className='p-float-label'>
                      <Calendar
                        id='basic'
                        {...input}
                        dateFormat='dd.mm.yy'
                        mask='99.99.9999'
                        showIcon
                        showTime
                      />
                      <label
                        htmlFor='datum'
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Dátum*
                      </label>
                    </span>
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name='id_lieku'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <span className='p-float-label '>
                      <Dropdown
                        id='id_lieku'
                        {...input}
                        options={drugs}
                        optionLabel='id'
                      />
                      <label
                        htmlFor='id_lieku'
                        className={classNames({
                          'p-error': isFormFieldValid(meta),
                        })}
                      >
                        Liek
                      </label>
                    </span>
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
