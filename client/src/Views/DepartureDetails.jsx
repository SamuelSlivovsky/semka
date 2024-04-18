import { useEffect, useState } from "react";
import { Controller, useForm } from 'react-hook-form';
import { InputText } from "primereact/inputtext";
import { classNames } from 'primereact/utils';

export default function DepartureDetails(props) {
  const formValue = {
    ADDRESS_FROM: 'address_from',
    ADDRESS_TO: 'address_to',
    WHERE_FROM: 'where_from',
    WHERE_TO: 'where_to',
    HOSPITAL_FROM: 'hospital_from',
    HOSPITAL_TO: 'hospital_to',
    LASTING: 'lasting'
  }

  const [defaultValues, setDefaultValues] = useState({});

  const {
    control,
    setValue,
    reset
  } = useForm({ defaultValues });

  useEffect(() => {
    const defaultValuesTemp = {
      where_from: '',
      where_to: '',
      direction_from: '',
      direction_to: '',
      lasting: ''
    }
  
    setDefaultValues(defaultValuesTemp);
  }, [])

  useEffect(() => {
    //reset();
    const defaultValuesTemp = {
      where_from: '',
      where_to: '',
      direction_from: '',
      direction_to: '',
      lasting: ''
    }
  
    setDefaultValues(defaultValuesTemp);
    
    setValue("where_from", props.departureInfo.MESTO_ODKIAL);
    setValue("where_to", props.departureInfo.MESTO_KAM);
    setValue("lasting", props.departureInfo.TRVANIE);

    if (props.departureInfo.NEMOCNICA_KAM && props.departureInfo.NEMOCNICA_ODKIAL) {
      setValue("direction_from", props.departureInfo.NEMOCNICA_ODKIAL);
      setValue("direction_to", props.departureInfo.NEMOCNICA_KAM);
    } else if (props.departureInfo.ADRESA_ODKIAL && props.departureInfo.NEMOCNICA_KAM) {
      setValue("direction_from", props.departureInfo.ADRESA_ODKIAL);
      setValue("direction_to", props.departureInfo.NEMOCNICA_KAM);
    } else if (props.departureInfo.NEMOCNICA_ODKIAL && props.departureInfo.ADRESA_KAM) {
      setValue("direction_from", props.departureInfo.NEMOCNICA_ODKIAL);
      setValue("direction_to", props.departureInfo.ADRESA_KAM);
    }
  }, [props.departureInfo])

  const getLabelText = (fieldName) => {
    switch(fieldName) {
      case formValue.ADDRESS_FROM:
        return "Adresa začiatku výjazdu";
      case formValue.ADDRESS_TO:
        return "Adresa konca výjazdu";
      case formValue.WHERE_FROM:
        return "Mesto začiatku výjazdu";
      case formValue.WHERE_TO:
        return "Mesto konca výjazdu";
      case formValue.HOSPITAL_FROM:
        return "Nemocnica začiatku výjazdu";
      case formValue.HOSPITAL_TO:
        return "Nemocnica konca výjazdu";
      default:
        return "Trvanie výjazdu";
    }
  }

  const renderControllerDiv = (fieldName) => {
    return (
      <div className="field">
        <span className="p-float-label">
          <Controller 
            name={fieldName}
            control={control} 
            render={({ field, fieldState }) => (
              <InputText 
                id={field.name} 
                value={fieldName == formValue.LASTING ? `${field.value} minút` : `${field.value}`}
                disabled={true}
                className={classNames({ 'p-invalid': fieldState.invalid })}  
              />
            )}
          />
          <label htmlFor={fieldName}>{getLabelText(fieldName)}</label>
        </span>
      </div>
    );
  }

  const renderDirection = () => {
    return (
      <div>
        <form className="p-fluid">
          <div className="departure-plan-hospital-details departure-details-first-row">
            { renderControllerDiv("where_from") }
            { renderControllerDiv("where_to") }
          </div>

          <div className="departure-plan-hospital-details">
            { renderControllerDiv("direction_from") }
            { renderControllerDiv("direction_to") } 
          </div>

          <div className="departure-plan-hospital-details">
            { renderControllerDiv("lasting")} 
          </div>
        </form>
      </div>
    );
  }

  return <div>{renderDirection()}</div>;
}