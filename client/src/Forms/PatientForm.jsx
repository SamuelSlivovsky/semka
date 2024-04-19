import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { AutoComplete } from "primereact/autocomplete";
import { Checkbox } from "primereact/checkbox";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import GetUserData from "../Auth/GetUserData";
import {Toast} from "primereact/toast";

const toast = useRef(null);
export default function PatientForm(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [cities, setCities] = useState([]);
  const [filteredPsc, setFilteredPsc] = useState(null);
  const [insurances, setInsurances] = useState([]);
  const profile = props.profile;
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch("/add/psc", { headers })
      .then((response) => response.json())
      .then((res) => {
        let array = [];
        array = res.map((item) => item);
        setCities(array);
      });
    fetch("/poistovna/all", { headers })
      .then((response) =>{
          if (response.ok) {
              return response.json();
              // Kontrola ci je token expirovany (status:410)
          } else if (response.status === 410) {
              // Token expiroval redirect na logout
              toast.current.show({
                  severity: "error",
                  summary: "Session timeout redirecting to login page",
                  life: 999999999,
              });
              setTimeout(() => {
                  navigate("/logout");
              }, 3000);
          }
      })
      .then((res) => {
        setInsurances(res);
      });
  }, []); // eslint-disable-line;
  const validate = (data) => {
    let errors = {};
    if (!data.meno) {
      errors.meno = "Meno je povinné";
    }
    if (!data.priezvisko) {
      errors.priezvisko = "Priezvisko je povinné";
    }
    if (!data.cudzinec && !data.rod_cislo) {
      errors.rod_cislo = "Rodné číslo je povinné";
    }
    if (!data.cudzinec && !data.poistovna) {
      errors.poistovna = "Poisťovňa je povinná";
    }
    if (!data.cudzinec && !data.poistenec) {
      errors.poistenec = "Číslo poistenca je povinné";
    }
    if (!data.psc) {
      errors.psc = "PSČ je povinné";
    }
    if (!data.tel) {
      errors.tel = "Telefón je povinný";
    }
    if (!data.dat_od) {
      errors.dat_od = "Dátum zápisu je povinný";
    }

    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem("hospit-user");
    const userData = GetUserData(token);
    const requestOptionsPatient = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },

      body: JSON.stringify({
        rod_cislo: data.rod_cislo,
        meno: data.meno,
        priezvisko: data.priezvisko,
        psc: data.psc.psc,
        id_lekara: userData.UserInfo.userid,
        ulica: data.ulica,
        dat_od: data.dat_od.toLocaleString("en-GB").replace(",", ""),
        dat_narodenia: data.dat_narodenia
          ? data.dat_narodenia.toLocaleString("en-GB").replace(",", "")
          : "",
        cudzinec: data.cudzinec,
        dat_do:
          data.dat_do != null && data.dat_do != ""
            ? data.dat_do.toLocaleString("en-GB").replace(",", "")
            : null,
        pohlavie: data.pohlavie,
        typ_krvi: data.typ_krvi,
        poistenec: data.poistenec,
        poistovna: data.poistovna?.ICO,
        tel: data.tel,
        mail: data.mail,
      }),
    };
    if (profile && profile != null) {
      await fetch("/patient/update", requestOptionsPatient).then(() =>
        setShowMessage(true)
      );
    } else {
      await fetch("/add/pacient", requestOptionsPatient).then(() =>
        setShowMessage(true)
      );
    }

    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  const searchPsc = (event) => {
    setTimeout(() => {
      let _filteredPsc;
      if (!event.query.trim().length) {
        _filteredPsc = [...cities];
      } else {
        _filteredPsc = cities.filter((city) => {
          return city.name.toLowerCase().startsWith(event.query.toLowerCase());
        });
      }

      setFilteredPsc(_filteredPsc);
    }, 250);
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => setShowMessage(false)}
      />
    </div>
  );
  return (
      <div
          style={{width: "100%", marginTop: "2rem", marginLeft: "10px"}}
          className="p-fluid grid formgrid"
      >
          <div><Toast ref={toast} position="top-center"/></div>
          <Dialog
              visible={showMessage}
              onHide={() => setShowMessage(false)}
              position="top"
              footer={dialogFooter}
              showHeader={false}
              breakpoints={{"960px": "80vw"}}
              style={{width: "30vw"}}
          >
              <div className="flex align-items-center flex-column pt-6 px-3">
                  <i
                      className="pi pi-check-circle"
                      style={{fontSize: "5rem", color: "var(--green-500)"}}
                  ></i>
                  <h5>Úspešné odoslanie údajov</h5>
              </div>
          </Dialog>

          <div className="field col-12">
              <Form
                  onSubmit={onSubmit}
                  initialValues={{
                      rod_cislo: profile && profile != null ? profile.ROD_CISLO : "",
                      mail: profile && profile != null ? profile.EMAIL : "",
                      meno: profile && profile != null ? profile.MENO : "",
                      priezvisko: profile && profile != null ? profile.PRIEZVISKO : "",
                      psc: profile && profile != null ? profile.PSC : "",
                      tel: profile && profile != null ? profile.TELEFON : "",
                      cudzinec:
                          profile && profile != null
                              ? profile.CUDZINEC == 0
                                  ? false
                                  : true
                              : false,
                      dat_narodenia:
                          profile && profile != null
                              ? new Date(profile.DATUM_NARODENIA)
                              : null,
                      pohlavie: "M",
                      typ_krvi: profile && profile != null ? profile.TYP_KRVI : "0-",
                      poistenec: profile && profile != null ? profile.ID_POISTENCA : 0,
                      poistovna:
                          profile && profile != null
                              ? insurances.find(
                                  (item) => item.NAZOV == profile.NAZOV_POISTOVNE
                              )
                              : null,
                      ulica: profile && profile != null ? profile.ULICA : "",
                      dat_od:
                          profile && profile != null
                              ? new Date(profile.DATUM_ZAPISU)
                              : new Date(),
                  }}
                  validate={validate}
                  render={({handleSubmit, form, values}) => (
                      <form onSubmit={handleSubmit} className="p-fluid">
                          <Field
                              name="meno"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="meno"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Meno*
                                      </label>
                                      <InputText
                                          id="meno"
                                          {...input}
                                          autoFocus
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />

                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <Field
                              name="priezvisko"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="priezvisko"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Priezvisko*
                                      </label>
                                      <InputText
                                          id="priezvisko"
                                          {...input}
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />

                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <Field
                              type="checkbox"
                              name="cudzinec"
                              render={({input, meta}) => (
                                  <div className="flex ml-2 mb-4" style={{gap: "10px"}}>
                                      <Checkbox id="cudzinec" {...input} />
                                      <label htmlFor="cudzinec">Cudzinec?*</label>
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          {!values.cudzinec ? (
                              <Field
                                  name="rod_cislo"
                                  render={({input, meta}) => (
                                      <div className="field col-12">
                                          <label
                                              htmlFor="rod_cislo"
                                              className={classNames({
                                                  "p-error": isFormFieldValid(meta),
                                              })}
                                          >
                                              Rodné číslo*
                                          </label>
                                          <InputMask
                                              id="rod_cislo"
                                              mask="999999/9999"
                                              {...input}
                                              className={classNames({
                                                  "p-invalid": isFormFieldValid(meta),
                                              })}
                                          />

                                          {getFormErrorMessage(meta)}
                                      </div>
                                  )}
                              />
                          ) : (
                              <>
                                  <Field
                                      name="pohlavie"
                                      render={({input, meta}) => (
                                          <div className="field col-12">
                                              <label htmlFor="dat_narodenia">Pohlavie*</label>
                                              <Dropdown
                                                  id="pohlavie"
                                                  {...input}
                                                  options={["M", "Ž"]}
                                              />
                                          </div>
                                      )}
                                  />
                                  <Field
                                      name="dat_narodenia"
                                      render={({input, meta}) => (
                                          <div className="field col-12">
                                              <label
                                                  htmlFor="dat_narodenia"
                                                  className={classNames({
                                                      "p-error": isFormFieldValid(meta),
                                                  })}
                                              >
                                                  Dátum narodenia*
                                              </label>
                                              <Calendar
                                                  id="dat_narodenia"
                                                  {...input}
                                                  className={classNames({
                                                      "p-invalid": isFormFieldValid(meta),
                                                  })}
                                              />

                                              {getFormErrorMessage(meta)}
                                          </div>
                                      )}
                                  />
                              </>
                          )}{" "}
                          <Field
                              name="typ_krvi"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label htmlFor="dat_narodenia">Krvná skupina*</label>
                                      <Dropdown
                                          id="pohlavie"
                                          {...input}
                                          filter
                                          options={[
                                              "0-",
                                              "0+",
                                              "B-",
                                              "B+",
                                              "A-",
                                              "A+",
                                              "AB-",
                                              "AB+",
                                          ]}
                                      />
                                  </div>
                              )}
                          />
                          <Field
                              name="psc"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="psc"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          PSČ*
                                      </label>
                                      <AutoComplete
                                          {...input}
                                          suggestions={filteredPsc}
                                          completeMethod={searchPsc}
                                          field="name"
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <Field
                              name="ulica"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="ulica"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Ulica
                                      </label>
                                      <InputText
                                          id="ulica"
                                          {...input}
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          {!values.cudzinec ? (
                              <>
                                  <Field
                                      name="poistenec"
                                      render={({input, meta}) => (
                                          <div className="field col-12">
                                              <label
                                                  htmlFor="poistenec"
                                                  className={classNames({
                                                      "p-error": isFormFieldValid(meta),
                                                  })}
                                              >
                                                  Číslo poistenca*
                                              </label>
                                              <InputMask
                                                  mask="99999999"
                                                  {...input}
                                                  id="poistenec"
                                                  className={classNames({
                                                      "p-invalid": isFormFieldValid(meta),
                                                  })}
                                              />
                                              {getFormErrorMessage(meta)}
                                          </div>
                                      )}
                                  />
                                  <Field
                                      name="poistovna"
                                      render={({input, meta}) => (
                                          <div className="field col-12">
                                              <label
                                                  htmlFor="poistovna"
                                                  className={classNames({
                                                      "p-error": isFormFieldValid(meta),
                                                  })}
                                              >
                                                  Poisťovňa*
                                              </label>
                                              <Dropdown
                                                  id="poistovna"
                                                  options={insurances}
                                                  optionLabel="NAZOV"
                                                  {...input}
                                                  className={classNames({
                                                      "p-invalid": isFormFieldValid(meta),
                                                  })}
                                              />
                                              {getFormErrorMessage(meta)}
                                          </div>
                                      )}
                                  />
                              </>
                          ) : (
                              ""
                          )}
                          <Field
                              name="tel"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="tel"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Telefónne číslo*
                                      </label>
                                      <InputText
                                          id="basic"
                                          {...input}
                                          placeholder="+4210912345678"
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <Field
                              name="mail"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="mail"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Email
                                      </label>
                                      <InputText
                                          id="basic"
                                          {...input}
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <Field
                              name="dat_od"
                              render={({input, meta}) => (
                                  <div className="field col-12">
                                      <label
                                          htmlFor="dat_od"
                                          className={classNames({
                                              "p-error": isFormFieldValid(meta),
                                          })}
                                      >
                                          Dátum zápisu pacienta*
                                      </label>
                                      <Calendar
                                          id="basic"
                                          {...input}
                                          dateFormat="dd.mm.yy"
                                          mask="99.99.9999"
                                          showIcon
                                          className={classNames({
                                              "p-invalid": isFormFieldValid(meta),
                                          })}
                                      />
                                      {getFormErrorMessage(meta)}
                                  </div>
                              )}
                          />
                          <div
                              className="field col-12 "
                              style={{justifyContent: "center", display: "grid"}}
                          >
                              <Button
                                  type="submit"
                                  style={{width: "50vh"}}
                                  className="p-button-lg"
                                  label="Odoslať"
                                  icon="pi pi-check"
                                  iconPos="right"
                              />
                          </div>
                      </form>
                  )}
              />
          </div>
      </div>
  );
}
