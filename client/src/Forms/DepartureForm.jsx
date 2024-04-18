import { Button } from "primereact/button";
import { Toast } from 'primereact/toast';
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useRef } from "react";
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import DepartureDetails from "../Views/DepartureDetails";
import "../styles/departure.css"

export default function DepartureForm(props) {
  const [visible, setVisible] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);
  const [plannedDepartures, setPlannedDeparture] = useState([]);
  const [freeVehicles, setFreeVehicles] = useState([]);
  const [selectedVehicle, setSelectedVehicles] = useState(null);
  const [selectedDeparture, setSelectedDeparture] = useState(null);
  const [isDepartureSelected, setIsDepartureSelected] = useState(false);
  const toast = useRef(null);
  const requiredMessage = "Toto pole je povinné.";
  
  const defaultValues = {
    vehicle: null
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
    getDepartures();
  }, [])

  useEffect(() => {
    if (selectedDeparture) {
      const token = localStorage.getItem("hospit-user");
      const headers = { authorization: "Bearer " + token };
      
      fetch(`/vozidla/volneVozidlo/${selectedDeparture.ID_PLAN_VYJAZDU}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setFreeVehicles(data);
      });
    }
  }, [selectedDeparture])

  const handleClick = () => {
    setVisible(true);
  }

  const onHideNewVehicle = () => {
    setVisible(false);
    setSelectedDeparture(null);
    reset();
  }

  const getFormErrorMessage = (name) => {
    return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error"></small>;
  };

  const onSubmit = (data) => { 
    const token = localStorage.getItem("hospit-user");
    if (data) {
      const requestDep = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          ecv: data.vehicle.ECV,
          id_departure_plan: selectedDeparture.ID_PLAN_VYJAZDU
        }),
      };
      console.log(requestDep);
      fetch(
        "/vyjazdy/vehicleToDeparture",
        requestDep
      ).then(() => {
        getDepartures();

        reset();
        setVisible(false);
      })   

      getDepartures();

      reset();
      setSelectedDeparture(null);
      setVisible(false);
    }
  }

  const getDepartures = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    fetch(`/vyjazdy/departures/noVehicles`, { headers })
    .then((response) => response.json())
    .then((data) => {
      setPlannedDeparture(data);
    });

  }

  const templateVehicles = (option) => {
    return (
      <div className="flex align-items-center">
          <div>{option.ECV}</div>
          <div>&nbsp; - &nbsp;</div>
          <div>{option.TYP_VOZIDLA}</div>
        </div>
    );
  }

  const selectedOptionTemplateVehicles = (option, props) => {
    if (option) {
      return templateVehicles(option);
    }

    return <span>{props.placeholder}</span>;
   }

  const optionTemplateVehicles = (option) => {
    return templateVehicles(option);
  }

  const templateDeparture = (option) => {
    return (
      <div className="flex align-items-center">
          <div>{option.DATUM_OD}</div>
          <div>&nbsp; - &nbsp;</div>
          <div>{option.TYP}</div>
          <div>, &nbsp;Čas odchodu: &nbsp;</div>
          <div>{option.CAS_ODCHODU}</div>
        </div>
    );
  }

  const selectedOptionTemplateDeparture = (option, props) => {
    if (option) {
      return templateDeparture(option);
    }

    return <span>{props.placeholder}</span>;
  };

  const optionTemplateDeparture = (option) => {
    return templateDeparture(option);
  };

  const renderDetails = () => {
    if (selectedDeparture && isDepartureSelected) {
      return <DepartureDetails departureInfo={selectedDeparture}></DepartureDetails>;
    } else {
      return null;
    }
  }
    

  return (
    <div>
      <Toast ref={toast} />
      <Button 
        label={<i className="pi pi-plus"></i>}
        onClick={() => handleClick()}
      ></Button>
        <Dialog
          header="Výjazd"
          visible={visible}
          onHide={() => onHideNewVehicle()}
          style={{width: "65rem", minHeight: "15rem"}}
        >
          <div className="departure-form-content">
            <div className="first-field p-fluid">
              <span className="p-float-label">
                <Controller 
                  name="departure_plan" 
                  control={control} 
                  rules={{required: requiredMessage}} 
                  render={({ field }) => (
                  <Dropdown 
                    id={field.name} 
                    {...field}
                    onChange={(e) => {
                      field.onChange(e.value);
                      setSelectedDeparture(e.value);
                      setIsDepartureSelected(true);
                    }} 
                    options={plannedDepartures} 
                    valueTemplate={selectedOptionTemplateDeparture}
                    itemTemplate={optionTemplateDeparture}
                    optionLabel={"TYP"} 
                  />
                )} />
                <label htmlFor="departure_plan" className={classNames({ 'p-error': errors.departure_plan })}>Naplánovaný výjazd*</label>
              </span>
              {getFormErrorMessage('departure_plan')}
            </div>
          
            {renderDetails()}   

            <form 
              onSubmit={handleSubmit(onSubmit)} 
              className="p-fluid"
              style={{ display: selectedDeparture ? 'block' : 'none' }}
            >
              <div className="departure-form-row">
                <div className="field">
                  <span className="p-float-label">
                  <Controller 
                    name="vehicle" 
                    control={control} 
                    rules={{required: requiredMessage}} 
                    render={({ field }) => (
                      <Dropdown 
                          id={field.name} 
                          {...field}
                          onChange={(e) => field.onChange(e.value)} 
                          options={freeVehicles} 
                          valueTemplate={selectedOptionTemplateVehicles}
                          itemTemplate={optionTemplateVehicles}
                          optionLabel="ECV" 
                      />
                    )} 
                  />
                  <label htmlFor="vehicle" className={classNames({ 'p-error': errors.vehicle })}>Vozidlo*</label>
                  </span>
                  {getFormErrorMessage('vehicle')}
                </div>
                <div>
                  <Button label={"Optimalizovať vozidlá"} type="button"/>
                </div>
              </div>
                  
              <div className="departure-form-submit-button">
                <Button label={"Pridať vozidlo k výjazdu"} type="Submit"/>
              </div>
            </form>
          </div>
        </Dialog>
    </div>
  )
}