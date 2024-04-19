import React, { useState, useEffect, useRef } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { Dropdown } from "primereact/dropdown";
import GetUserData from "../Auth/GetUserData";
import { InputText } from "primereact/inputtext";
import { Checkbox } from "primereact/checkbox";
import { Toast } from "primereact/toast";
export default function RecipeForm(props) {
  const toast = useRef(null);
  const [drugs, setDrugs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const requestOptions = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
    };
    fetch("/lieky/all", requestOptions)
      .then((response) => {
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
      .then((data) => {
        setDrugs(data);
      });
  }, []);

  const validate = (data) => {
    let errors = {};

    if (!data.rod_cislo) {
      errors.rod_cislo = "Rodné číslo je povinné";
    }
    if (!data.datum) {
      errors.datum = "Dátum je povinný";
    }
    if (!data.liek) {
      errors.liek = "Liek je povinný";
    }
    return errors;
  };

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem("hospit-user");
    const userData = GetUserData(token);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        rod_cislo: data.rod_cislo,
        datum_zapisu: data.datum.toLocaleString("en-GB").replace(",", ""),
        id_lieku: data.liek.ID_LIEK,
        cislo_zam: userData.UserInfo.userid,
        datum_vyzdvihnutia: null,
        poznamka: data.note,
        opakujuci: data.check ? 1 : 0,
      }),
    };
    await fetch("/add/recept", requestOptions)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "Úspešné zapísanie receptu",
            life: 6000,
          });
        }
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: error.message,
          life: 6000,
        });
      });
    form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
  };

  return (
    <div
      style={{ width: "100%", marginTop: "2rem" }}
      className="p-fluid grid formgrid"
    >
      <Toast ref={toast} />

      <div className="field col-12">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            rod_cislo:
              typeof props.rod_cislo !== "undefined" ? props.rod_cislo : "",
            datum: null,
            liek: null,
            note: "",
            check: false,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
                name="rod_cislo"
                render={({ input, meta }) => (
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
                      autoFocus
                      id="rod_cislo"
                      mask="999999/9999"
                      {...input}
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                      disabled={
                        typeof props.rod_cislo !== "undefined" ? true : false
                      }
                    />

                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />

              <Field
                name="datum"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="datum"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Dátum*
                    </label>
                    <Calendar
                      id="basic"
                      {...input}
                      dateFormat="dd.mm.yy"
                      mask="99.99.9999"
                      showIcon
                      showTime
                    />

                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="liek"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="liek"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Liek*
                    </label>
                    <Dropdown
                      id="liek"
                      {...input}
                      options={drugs}
                      optionLabel="NAZOV"
                      filter
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="check"
                type="checkbox"
                render={({ input, meta }) => (
                  <div
                    className="field col-12"
                    style={{ display: "flex", gap: "8px" }}
                  >
                    <Checkbox id="check" {...input} type="checkbox" />
                    <label htmlFor="check">Opakujúci recept</label>
                  </div>
                )}
              />
              <Field
                name="note"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="note">Poznámka</label>
                    <InputText id="note" {...input} />
                  </div>
                )}
              />
              <div
                className="field col-12 "
                style={{ justifyContent: "center", display: "grid" }}
              >
                <Button
                  type="submit"
                  style={{ width: "50vh" }}
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
