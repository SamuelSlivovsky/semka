import React, { useState, useEffect, useRef } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router';
import '../styles/auth.css';
import { Toast } from 'primereact/toast';
import publicIP from 'react-native-public-ip';

export const Login = () => {
  const [showMessage, setShowMessage] = useState(false);
  const navigate = useNavigate();
  const toast = useRef(null);
  const [logDetails, setLogDetails] = useState(null);
  const oldLogDetails = null;
  const defaultValues = {
    userid: '',
    password: '',
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm({ defaultValues });

  useEffect(() => {
    getUserLogData();
    const token = localStorage.getItem('hospit-user');
    if (token !== null) {
      navigate('/');
    }
  }, []);

  const onSubmit = (data) => {
    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userid: data.userid,
        pwd: data.password,
        ip: logDetails,
      }),
    };
    fetch('/api/api/auth/login', requestOptions)
      .then((response) => response.json())
      .then((res) => {
        if (res.message !== undefined) {
          navigate('/logout');
          navigate('/login');
          toast.current.show({
            severity: 'error',
            summary: res.message,
            life: 999999999,
          });
        } else {
          localStorage.setItem('hospit-user', res.accessToken);
          window.location.reload(false);
        }
      });

    reset();
  };

  const getUserLogData = () => {
    publicIP()
      .then((ip) => {
        setLogDetails(ip);
      })
      .catch((error) => {
        console.log(error);
      });
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
        </div>
      </Dialog>

      <div className='flex justify-content-center'>
        <div className='card'>
          <h5 className='text-center'>Prihlásenie</h5>
          <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
            <div className='field'>
              <span className='p-float-label p-input-icon-right'>
                <i className='pi pi-user' />
                <Controller
                  name='userid'
                  control={control}
                  rules={{
                    required: 'Identifikácia je povinná',
                    pattern: {
                      message: 'Nesprávna identifikácia',
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
                  htmlFor='userid'
                  className={classNames({ 'p-error': !!errors.userid })}
                >
                  Prihlasovacie číslo*
                </label>
              </span>
              {getFormErrorMessage('userid')}
            </div>
            <div className='field'>
              <span className='p-float-label'>
                <Controller
                  name='password'
                  control={control}
                  rules={{ required: 'Password is required.' }}
                  render={({ field, fieldState }) => (
                    <Password
                      id={field.name}
                      {...field}
                      toggleMask
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      feedback={false}
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
              <a href='register'>Nemáte účet?</a>
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
