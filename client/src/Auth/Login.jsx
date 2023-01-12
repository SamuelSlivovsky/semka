import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { classNames } from 'primereact/utils';
import '../styles/auth.css';

export const Login = () => {
  const [showMessage, setShowMessage] = useState(false);
  const [formData, setFormData] = useState({});
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

  const onSubmit = (data) => {
    setFormData(data);
    setShowMessage(true);

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

  return (
    <div className='auth-form-container'>
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
          <h5>Registration Successful!</h5>
          <p style={{ lineHeight: 1.5, textIndent: '1rem' }}>
            Your account is registered under name <b>{formData.name}</b> ; it'll
            be valid next 30 days without activation. Please check{' '}
            <b>{formData.email}</b> for activation instructions.
          </p>
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
                  Password*
                </label>
              </span>
              {getFormErrorMessage('password')}
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
