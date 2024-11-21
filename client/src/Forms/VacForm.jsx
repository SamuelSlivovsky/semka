import React, { useEffect, useState } from 'react';
import { Form, Field } from 'react-final-form';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputMask } from 'primereact/inputmask';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
export default function VacForm(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [vaccines, setVaccines] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('hospit-user');
    const headers = { authorization: 'Bearer ' + token };

    fetch(`selects/typyOckovania`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVaccines(data);
      });
  }, []);

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem('hospit-user');
    const requestOptionsPatient = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        authorization: 'Bearer ' + token,
      },
      body: JSON.stringify({
        rod_cislo: data.rod_cislo === '' ? null : data.rod_cislo,
        id_vakciny: data.vac.ID_VAKCINY,
        datum: data.datum.toLocaleString('en-GB').replace(',', ''),
      }),
    };
    await fetch('/api/add/ockovanie', requestOptionsPatient)
      .then((res) => {
        if (res.ok) setShowMessage(true);
        else throw Error(res);
      })
      .catch((err) => console.log(err));

    form.restart();
  };

  const dialogFooter = (
    <div className='flex justify-content-center'>
      <Button
        label='OK'
        className='p-button-text'
        autoFocus
        onClick={() => {
          setShowMessage(false);
          props.hideDialog();
          props.onInsert();
        }}
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
        onHide={() => {
          setShowMessage(false);
        }}
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
          <h5>Úspešné pridanie očkovania</h5>
        </div>
      </Dialog>

      <div className='field col-12'>
        <Form
          onSubmit={onSubmit}
          initialValues={{
            rod_cislo:
              props.rod_cislo !== null || typeof props.rod_cislo !== 'undefined'
                ? props.rod_cislo
                : '',
            vac: null,
            datum: null,
          }}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className='p-fluid'>
              <Field
                name='rod_cislo'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label htmlFor='rod_cislo'>Rodné číslo</label>
                    <InputMask
                      id='rod_cislo'
                      mask='999999/9999'
                      disabled={
                        props.rod_cislo !== null &&
                        typeof props.rod_cislo !== 'undefined'
                          ? true
                          : false
                      }
                      {...input}
                    />
                  </div>
                )}
              />
              <Field
                name='vac'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label htmlFor='vac'>Očkovanie*</label>
                    <Dropdown
                      id='vac'
                      {...input}
                      options={vaccines}
                      optionLabel='NAZOV'
                      filter
                    />
                  </div>
                )}
              />

              <Field
                name='datum'
                render={({ input, meta }) => (
                  <div className='field col-12'>
                    <label htmlFor='datum'>Dátum očkovania*</label>
                    <Calendar
                      id='basic'
                      {...input}
                      dateFormat='dd.mm.yy'
                      mask='99.99.9999'
                      showIcon
                      showTime
                    />
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
