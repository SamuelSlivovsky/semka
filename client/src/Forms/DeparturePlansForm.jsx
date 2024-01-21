import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import { useState } from "react";
import { useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Controller, useForm } from 'react-hook-form';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { useEffect } from "react";
import { InputNumber } from 'primereact/inputnumber';
import "../styles/departurePlansForm.css";

export default function DeparturePlansForm() {
  const [tyteOfPlans, setTypeOfPlans] = useState([]);
  const [visible, setVisible] = useState(false);
  const toast = useRef(null);
  const requiredMessage = "Toto pole je povinné.";
  let today = new Date();

  const defaultValues = {
    plan_type: null,
    lasting: 0,
    where_from: '',
    where_to: '',
    start: null,
    start_time: null
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset
  } = useForm({ defaultValues });

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    
    fetch(`/vyjazdy/types`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setTypeOfPlans(data);
      });
  }, []);

  const handleClick = () => {
    setVisible(true);
  }

  const onHideNewVehicle = () => {
    setVisible(false);
    reset();
  }

  const show = () => {
    toast.current.show({ severity: 'success', summary: 'Nový plánovaný výjazd úspešne vytvorený' });
  };

  const onSubmit = (data) => {
    const token = localStorage.getItem("hospit-user");

    if (data) {
      show();

      const requestDepPlan = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          start: data.start.toLocaleString("en-GB").split(",")[0] + data.start_time.toLocaleString("en-GB").split(",")[1],
          departure_type: data.plan_type.ID_TYPU_VYJAZDU,
          where_from: data.where_from,
          where_to: data.where_to,
          lasting: data.lasting
        }),
      };

      fetch(
        "/vyjazdy/newPlan",
        requestDepPlan
      ).then(() => {
        reset();
        setVisible(false);
      })

      setVisible(false);
      reset();
    }
  };

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error"></small>;
  };

  return (
    <div className="departure-plans-form-container">
      <Toast ref={toast} />
      <Button label={<i className="pi pi-plus"></i>} onClick={() => handleClick()}></Button>
      <Dialog
        header="Nový výjazd"
        visible={visible}
        onHide={() => onHideNewVehicle()}
        style={{width: "65rem"}}
      >
        <div className="card flex justify-content-center departure-plans-form">
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">

            <div className="departure-plans-form-row departure-plans-form-row-first-row">
              <div className="field">
                <span className="p-float-label">
                  <Controller 
                    name="plan_type" 
                    control={control} 
                    rules={{required: requiredMessage}} 
                    render={({ field }) => (
                    <Dropdown 
                      id={field.name} 
                      {...field}
                      onChange={(e) => field.onChange(e.value)} 
                      options={tyteOfPlans} 
                      optionLabel="NAZOV" />
                  )} />
                  <label htmlFor="plan_type" className={classNames({ 'p-error': errors.plan_type })}>Typ výjazdu*</label>
                </span>
                {getFormErrorMessage('plan_type')}
              </div>
              <div className="field">
                <span className="p-float-label">
                <Controller 
                  name="lasting" 
                  control={control} 
                  rules={{required: requiredMessage, min: 0}}   
                  render={({ field, fieldState }) => (
                    <InputNumber 
                      id={field.name} 
                      ref={field.ref} 
                      value={field.value} 
                      onBlur={field.onBlur} 
                      onValueChange={(e) => field.onChange(e)} 
                      //useGrouping={false}
                      className={classNames({ 'p-invalid': fieldState.invalid })} 
                    />
                  )} />
                  <label htmlFor="lasting" className={classNames({ 'p-error': errors.lasting })}>Odhadované trvanie v minútach*</label>
                </span>
                {getFormErrorMessage('lasting')}
              </div>
            </div>

            <div className="departure-plans-form-row departure-plans-form-row-second-row">
              <div className="field">
                <span className="p-float-label">
                <Controller 
                  name="where_from" 
                  control={control} 
                  rules={{required: requiredMessage}}   
                  render={({ field, fieldState }) => (
                    <InputText  
                      id={field.name} 
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )} />
                  <label htmlFor="where_from" className={classNames({ 'p-error': errors.where_from })}>Odkiaľ*</label>
                </span>
                {getFormErrorMessage('where_from')}
              </div>
              <div className="field">
                <span className="p-float-label">
                <Controller 
                  name="where_to" 
                  control={control} 
                  rules={{required: requiredMessage}}   
                  render={({ field, fieldState }) => (
                    <InputText 
                      id={field.name} 
                      {...field}
                      className={classNames({ 'p-invalid': fieldState.invalid })} />
                  )} />
                  <label htmlFor="where_to" className={classNames({ 'p-error': errors.where_to })}>Kam*</label>
                </span>
                {getFormErrorMessage('where_to')}
              </div>
            </div>

            <div className="departure-plans-form-row departure-plans-form-row-third-row">
              <div className="field">
                <span className="p-float-label">
                  <Controller 
                    name="start" 
                    control={control} 
                    rules={{required: requiredMessage}} 
                    render={({ field }) => (
                      <Calendar 
                        id={field.name} 
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)} 
                        minDate={today}
                        dateFormat="dd/mm/yy" 
                        mask="99/99/9999" 
                        showIcon />
                    )} />
                  <label htmlFor="start" className={classNames({ 'p-error': errors.start })}>Dátum začiatku výjazdu*</label>
                </span>
                {getFormErrorMessage('start')}
              </div>
              <div className="field">
                <span className="p-float-label">
                  <Controller 
                    name="start_time" 
                    control={control} 
                    rules={{required: requiredMessage}} 
                    render={({ field }) => (
                      <Calendar 
                        id={field.name} 
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)} 
                        icon={() => <i className="pi pi-clock" />}
                        mask="99:99"
                        showIcon 
                        timeOnly
                      />
                    )} />
                  <label htmlFor="start_time" className={classNames({ 'p-error': errors.start_time })}>Čas začiatku výjazdu*</label>
                </span>
                {getFormErrorMessage('start_time')}
              </div>
            </div>
            
            <div className="departure-plan-form-submit-button">
              <Button label={"Naplánovať výjazd"} type="Submit"/>
            </div>
          </form>
        </div>
      </Dialog>
    </div>
  )
}