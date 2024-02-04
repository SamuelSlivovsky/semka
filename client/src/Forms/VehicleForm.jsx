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
import { FileUpload } from 'primereact/fileupload';
import moment from 'moment';
import "../styles/vehicleForm.css"

export default function VehicleForm(props) {
  const [hospitals, setHospitals] = useState([]);
  const [vehicleAllECV, setVehicleAllECV] = useState([]);
  const [visible, setVisible] = useState(false);
  const [base64Data, setBase64Data] = useState(null);
  const fileUploader = useRef(null);

  const defaultValues = {
    ecv: '',
    hospital: null,
    vehicleType: '',
    stk: null
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    getValues,
    setValue,
    reset
  } = useForm({ defaultValues });

  const requiredMessage = "Toto pole je povinné.";
  let today = new Date();
  const toast = useRef(null);

  useEffect(() => {
    if (props && props.edit) {
      setValue('ecv', props.body.ECV);
      setValue('hospital', getHospital(props.body.NAZOV));
      setValue('vehicleType', props.body.TYP_VOZIDLA);
      setValue('stk', moment(props.body.DAT_STK, 'D.M.YYYY').toDate());
    }
  }, [props, setValue]);

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

  const getHospital = (name) => {
    return hospitals.find(hospital => hospital.NAZOV === props.body.NAZOV);
  }

  const showNewVehicleDialog = () => {
    setVisible(true);
  }

  const onHideNewVehicle = () => {
    if (props) {
      props.closeDialog();
    }
    setVisible(false);
  };

  const show = () => {
    toast.current.show({ severity: 'success', summary: 'Vozidlo úspešne vytvorené' });
  };

  const showEdit = () => {
    toast.current.show({ severity: 'success', summary: 'Vozidlo úspešne upravené' });
  };

  const showError = () => {
    toast.current.show({ severity: 'error', summary: 'Vozidlo sa nepodarilo vytvoriť', detail: 'Vozidlo s daným EČV už existuje!' });
  }

  const headerTemplate = (options) => {
    const { className, chooseButton, cancelButton } = options;
    return (
      <div
        className={className}
        style={{
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
        }}
      >
        {chooseButton}
        {cancelButton}
      </div>
    );
  };

  const customBase64Uploader = async (event) => {
    // convert file to base64 encoded 
    const file = event.files[0];
    const reader = new FileReader();
    let blob = await fetch(file.objectURL).then((r) => r.blob()); //blob:url
    reader.readAsDataURL(blob);
    reader.onloadend = function () {
      setBase64Data(reader.result.substring(reader.result.indexOf(",") + 1));
    };
  };

  const onSubmit = async (data) => {
    const token = localStorage.getItem("hospit-user");
    let ecvExists = vehicleAllECV.find(ecv => ecv.ECV === data.ecv);

    if (ecvExists === undefined && !props.edit) {
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
          stk: data.stk.toLocaleString("en-GB").replace(",", ""),
          obrazok: base64Data
        }),
      };

      fetch(
        "/vozidla/noveVozidlo",
        requestNewVehicle
      ).then(() => {
        reset();
        setVisible(false);
      }) 
    } else if (props.edit) {
      showEdit();

      const requestVehicle = {
        method: "PUT",
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

      fetch(
        "/vozidla/editVozidlo",
        requestVehicle
      ).then(() => {
        props.closeDialog();
        reset();
        setVisible(false);
      })  
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
          <form onSubmit={handleSubmit(onSubmit)} className="p-fluid vehicle-form">
          
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
                    //value={field}
                    disabled={props != null && props.edit ? true : false}
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
                    {...field}
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
                      {...field}
                      //value={field.value}
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
            <FileUpload
                  ref={fileUploader}
                  mode="advanced"
                  accept="image/*"
                  customUpload
                  chooseLabel="Vložiť"
                  cancelLabel="Zrušiť"
                  headerTemplate={headerTemplate}
                  maxFileSize={5000000000}
                  onSelect={customBase64Uploader}
                  uploadHandler={customBase64Uploader}
                  emptyTemplate={
                    <p className="vehicle-form-image">
                      Vložte obrázok vozidla.
                    </p>
                  }
                />
            <div className="vehicle-form-submit-button">
              <Button label={props && props.edit ? "Upraviť vozidlo" : "Vytvoriť vozidlo"} type="Submit"/>
            </div>
          </form>
        </div>
      </Dialog> 
    </div>
  )
}