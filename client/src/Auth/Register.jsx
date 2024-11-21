import React, { useState, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { InputMask } from 'primereact/inputmask';
import { useNavigate } from 'react-router';
import '../styles/auth.css';
import { redirect } from 'react-router-dom';
import { Toast } from 'primereact/toast';
import { InputNumber } from 'primereact/inputnumber';
import GetUserData from './GetUserData';
import user from '../Views/User';
import { Divider } from 'primereact/divider';

export const Register = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
  const header = <div className='font-bold mb-3'>Zadaj heslo</div>;
  const footer = (
    <>
      <Divider />
      <p className='mt-2'>Musi obsahovat</p>
      <ul className='pl-2 ml-2 mt-0 line-height-3'>
        <li>Aspoň jedno malé písmeno</li>
        <li>Aspoň jedno veľké písmeno</li>
        <li>Aspoň jeden číselný údaj</li>
        <li>Aspoň jeden špeciálny znak</li>
        <li>Minimálne 8 znakov</li>
      </ul>
    </>
  );
  const navigate = useNavigate();
  const toast = useRef(null);
  const token = localStorage.getItem('hospit-user');
  const userDataHelper = GetUserData(token);
  const defaultValues = {
    rc: '',
    email: '',
    password: '',
    role: '',
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    let body;
    if (token && userDataHelper.UserInfo.role === 0) {
      body = JSON.stringify({
        userid: data.rc,
        pwd: data.password,
        role: data.role,
      });
    } else {
      body = JSON.stringify({
        userid: data.rc,
        pwd: data.password,
        role: 9999,
      });
    }

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: body,
    };

    fetch('/api/auth/register', requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (token && userDataHelper.UserInfo.role === 0) {
          if (res.message !== undefined) {
            toast.current.show({
              severity: 'error',
              summary: res.message,
              life: 999999999,
            });
          } else {
            toast.current.show({
              severity: 'success',
              summary: 'Registrácia prebehla úspešne',
              life: 999999999,
            });
          }
        } else {
          if (res.message !== undefined) {
            navigate('/logout');
            navigate('/register');
            toast.current.show({
              severity: 'error',
              summary: res.message,
              life: 999999999,
            });
          } else {
            localStorage.setItem('hospit-user', res.accessToken);
            navigate('/');
            window.location.reload();
          }
        }
      });
    reset();
  };
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
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
  const passwordHeader = <h6>Pick a password</h6>;
  return (
    <div className='auth-form-container'>
      <Toast ref={toast} position='top-center' />
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
        position='top'
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ '960px': '80vw' }}
        style={{ width: '30vw' }}
      >
        <div className='flex justify-content-center flex-column pt-6 px-3'>
          <i
            className='pi pi-check-circle'
            style={{ fontSize: '5rem', color: 'var(--green-500)' }}
          ></i>
          <h5>Registrácia prebehla úspešne pod mailom {formData.rc}</h5>
        </div>
      </Dialog>

      <div className='flex justify-content-center'>
        <div className='card'>
          <h5 className='text-center'>Registrácia</h5>
          <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
            <div className='field'>
              <span className='p-float-label'>
                <Controller
                  name='rc'
                  control={control}
                  rules={{
                    required: 'Rodné číslo je povinné',
                  }}
                  render={({ field, fieldState }) => {
                    if (token && userDataHelper.UserInfo.role === 0) {
                      return (
                        <InputText
                          id={field.name}
                          {...field}
                          autoFocus
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      );
                    } else {
                      return (
                        <InputMask
                          id={field.name}
                          {...field}
                          autoFocus
                          mask='999999/9999'
                          className={classNames({
                            'p-invalid': fieldState.invalid,
                          })}
                        />
                      );
                    }
                  }}
                />
                {(() => {
                  if (token && userDataHelper.UserInfo.role === 0) {
                    return (
                      <label
                        htmlFor='rc'
                        className={classNames({ 'p-error': errors.rc })}
                      >
                        ID zamestnanca*
                      </label>
                    );
                  } else {
                    return (
                      <label
                        htmlFor='rc'
                        className={classNames({ 'p-error': errors.rc })}
                      >
                        Rodné číslo*
                      </label>
                    );
                  }
                })()}
              </span>
              {getFormErrorMessage('rc')}
            </div>
            <div className='field'>
              <span className='p-float-label p-input-icon-right'>
                <i className='pi pi-envelope' />
                <Controller
                  name='email'
                  control={control}
                  rules={{
                    required: 'Email je povinnný.',
                    pattern: {
                      value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                      message:
                        'Nesprávny tvar e-mail adresa, napríklad: meno@email.com',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      {...field}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor='email'
                  className={classNames({ 'p-error': !!errors.email })}
                >
                  Email*
                </label>
              </span>
              {getFormErrorMessage('email')}
            </div>
            {(() => {
              if (token && userDataHelper.UserInfo.role === 0) {
                let zoznamRoly = [
                  'Lekár',
                  'Sestra',
                  'Primár',
                  'Záchranár',
                  'Skladník',
                  'Upratovačka',
                  'Sanitár',
                  'Laborant',
                  'Lekárnik',
                  'Manažér Lekárne',
                ];
                let roleOptions = zoznamRoly.map((role, index) => ({
                  label: role,
                  value: index + 1,
                }));
                return (
                  <div className='field'>
                    <span className='p-float-label'>
                      <Controller
                        name='role'
                        control={control}
                        rules={{ required: 'Zadaj rolu' }}
                        render={({ field, fieldState }) => (
                          <Dropdown
                            id={field.name}
                            {...field}
                            options={roleOptions}
                            onChange={(e) => {
                              field.onChange(e.value);
                            }}
                            className={classNames({
                              'p-invalid': fieldState.invalid,
                            })}
                          />
                        )}
                      />
                      <label
                        htmlFor='role'
                        className={classNames({ 'p-error': errors.role })}
                      >
                        Rola*
                      </label>
                    </span>
                    {getFormErrorMessage('role')}
                  </div>
                );
              } else {
                return null;
              }
            })()}

            <div className='field'>
              <span className='p-float-label'>
                <Controller
                  name='password'
                  control={control}
                  rules={{
                    required: 'Heslo je povinné',
                    minLength: {
                      value: 8,
                      message: 'Heslo musí mať aspoň 8 znakov',
                    },
                    pattern: {
                      value:
                        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                      message:
                        'Heslo musí obsahovať aspoň jedno veľké písmeno, jedno špeciálne znak a jedno číslo',
                    },
                  }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      header={header}
                      footer={footer}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                    />
                  )}
                />
                <label
                  htmlFor='password'
                  className={classNames({ 'p-error': errors.password })}
                >
                  Heslo*
                </label>
              </span>
              {getFormErrorMessage('password')}
              {(() => {
                if (token && userDataHelper.UserInfo.role === 0) {
                  return null;
                } else {
                  return (
                    <div>
                      <a href='login'>Máte už vytvorený účet?</a>
                    </div>
                  );
                }
              })()}
            </div>
            <Button
              type='submit'
              label='Zadaj'
              className='mt-2'
              style={{ marginTop: '10px' }}
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
