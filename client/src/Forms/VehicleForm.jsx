import React, { useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import { Toast } from 'primereact/toast';
import { InputText } from "primereact/inputtext";
import { useState } from 'react';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useEffect } from 'react';
import { Dialog } from 'primereact/dialog';
import moment from 'moment';
import "../styles/vehicleForm.css"

export default function VehicleForm(props) {
  const [hospitals, setHospitals] = useState([]);
  const [vehicleAllECV, setVehicleAllECV] = useState([]);
  const [visible, setVisible] = useState(false);

  const requiredMessage = "Toto pole je povinné.";
  let today = new Date();
  const toast = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/add/nemocnica/all`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setHospitals(data);
      });
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vozidla/ecvs`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVehicleAllECV(data);
      });
  }, []);

  const defaultValues = {
    ecv: props.edit ? props.body.ECV : '',
    hospital: props.edit ? props.body.NAZOV :  null,
    vehicleType: props.edit ? props.body.TYP_VOZIDLA :  '',
    stk: props.edit ? props.body.DAT_STK :  null
  }

  const getHospital = (name) => {
    return hospitals.find(hospital => hospital.NAZOV === props.body.NAZOV);
  }

  const showNewVehicleDialog = () => {
    setVisible(true);
  }

  const onHideNewVehicle = () => {
    if (props != null) {
      props.closeDialog();
    }
    setVisible(false);
  };

  const show = () => {
    toast.current.show({ severity: 'success', summary: 'Vozidlo úspešne vytvorené' });
  };

  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Vozidlo sa nepodarilo vytvoriť', detail: 'Vozidlo s daným EČV už existuje!' });
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    reset
  } = useForm({ defaultValues });

  const onSubmit = async (data) => {
    const token = localStorage.getItem("hospit-user");
    let ecvExists = vehicleAllECV.find(ecv => ecv.ECV === data.ecv);

    if (ecvExists === undefined) {
      show();
      const requestNewVehicle = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ecv: data.ecv,
          id_nemocnice: data.hospital.ID_NEMOCNICE,
          typ_vozidla: data.vehicleType,
          stk: data.stk.toLocaleString("en-GB").replace(",", "")
        }),
      };

      const responseVehicle = await fetch(
        "/vozidla/noveVozidlo",
        requestNewVehicle
      ).then();

      reset();
      setVisible(false);
    } else {
      showError();
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error"></small>;
  };

  return (
    <div>
      <Toast ref={toast} />
      <Button label="Pridať vozidlo" onClick={() => showNewVehicleDialog()}/>
      <Dialog
        header={props != null && props.edit ? "Vozidlo" : "Nové vozidlo"}
        visible={visible || (props != null && props.edit)}
        style={{width: "35rem"}}
        onHide={() => onHideNewVehicle()}
      >
        <div className="card flex justify-content-center vehicle-form">
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          
            <div className="field first">
              <span className="p-float-label">
              <Controller 
                name="ecv" 
                control={control} 
                rules={{required: requiredMessage}} 
                render={({ field, fieldState }) => (
                  <InputText 
                    id={field.name} 
                    {...field} 
                    value={props != null && props.edit ? props.body.ECV : field.value}  
                    className={classNames({ 'p-invalid': fieldState.invalid })} />
                )} />
                <label htmlFor="ecv" className={classNames({ 'p-error': errors.ecv })}>Evidenčné číslo vozidla*</label>
              </span>
              {getFormErrorMessage('ecv')}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller 
                  name="hospital" 
                  control={control} 
                  rules={{required: requiredMessage}} 
                  render={({ field }) => (
                  <Dropdown 
                    id={field.name} 
                    value={props && props.edit ? getHospital(props.body.NAZOV) : field.value} 
                    onChange={(e) => field.onChange(e.value)} 
                    options={hospitals} 
                    optionLabel="NAZOV" />
                )} />
                <label htmlFor="hospital" className={classNames({ 'p-error': errors.hospital })}>Nemocnica</label>
              </span>
              {getFormErrorMessage('hospital')}
            </div>
            <div className="field">
              <span className="p-float-label">
              <Controller 
                name="vehicleType" 
                control={control} 
                rules={{required: requiredMessage}} 
                render={({ field, fieldState }) => (
                  <InputText 
                    id={field.name} 
                    {...field} 
                    value={props && props.edit ? props.body.TYP_VOZIDLA : field.value}  
                    className={classNames({ 'p-invalid': fieldState.invalid })} />
                )} />
                <label htmlFor="vehicleType" className={classNames({ 'p-error': errors.vehicleType })}>Typ vozidla*</label>
              </span>
              {getFormErrorMessage('vehicleType')}
            </div>
            <div className="field">
              <span className="p-float-label">
                <Controller 
                  name="stk" 
                  control={control} 
                  rules={{required: requiredMessage}} 
                  render={({ field }) => (
                    <Calendar 
                      id={field.name} 
                      value={props && props.edit ? moment(props.body.DAT_STK, 'D.M.YYYY').toDate() : field.value} 
                      onChange={(e) => field.onChange(e.value)} 
                      maxDate={today}
                      dateFormat="dd/mm/yy" 
                      mask="99/99/9999" 
                      showIcon />
                  )} />
                <label htmlFor="stk" className={classNames({ 'p-error': errors.stk })}>STK</label>
              </span>
              {getFormErrorMessage('stk')}
            </div>
            <div className="vehicle-form-submit-button">
              <Button label={props && props.edit ? "Upraviť vozidlo" : "Vytvoriť vozidlo"} type="Submit"/>
            </div>
          </form>
        </div>
      </Dialog> 
    </div>
  )
}