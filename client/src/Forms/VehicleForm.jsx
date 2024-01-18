import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';

export default function VehicleForm(props) {
  const [formData, setFormData] = useState({});
  const defaultValues = {
    ecv: '',
    vehicleType: '',
    stk: null
  }
  const toast = useRef(null);

  const show = () => {
    toast.current.show({ severity: 'success', summary: 'Vozidlo úspešne vytvorené', detail: getValues('ecv') });
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues });

  const onSubmit = (data) => {
    setFormData(data);
    data.value && show();
    reset();
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error"></small>;
  };

  return (
    <div className="card flex justify-content-center vehicle-form">
      <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
      <Toast ref={toast} />
        <div className="field first">
          <span className="p-float-label">
          <Controller 
            name="ecv" 
            control={control} 
            rules={{ required: 'Evidenčné číslo vozidla je povinné zadať.' }} 
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="ecv" className={classNames({ 'p-error': errors.ecv })}>Evidenčné číslo vozidla*</label>
          </span>
          {getFormErrorMessage('ecv')}
        </div>
        <div className="field">
          <span className="p-float-label">
          <Controller 
            name="vehicleType" 
            control={control} 
            rules={{ required: 'Typ vozidla je povinné zadať.' }} 
            render={({ field, fieldState }) => (
              <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })} />
            )} />
            <label htmlFor="vehicleType" className={classNames({ 'p-error': errors.vehicleType })}>Typ vozidla*</label>
          </span>
          {getFormErrorMessage('vehicleType')}
        </div>
        <div className="field">
          <span className="p-float-label">
            <Controller name="stk" control={control} render={({ field }) => (
              <Calendar 
                id={field.name} 
                value={field.value} 
                onChange={(e) => field.onChange(e.value)} 
                dateFormat="dd/mm/yy" 
                mask="99/99/9999" 
                showIcon />
             )} />
            <label htmlFor="stk">STK</label>
          </span>
        </div>
        <div className="vehicle-form-submit-button">
          <Button label="Vytvoriť vozidlo" type="submit"/>
        </div>
      </form>
    </div>
  )
}