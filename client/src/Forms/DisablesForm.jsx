import React, { useEffect, useRef, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
import {useNavigate} from "react-router";
export default function DisablesForm(props) {
    const navigate = useNavigate();
  const toast = useRef(null);
  const [types, setTypes] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    fetch(`selects/typyZTP`, { headers })
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
        console.log(data);
        setTypes(data);
      });
  }, []);

  const onSubmit = async (data, form) => {
    const token = localStorage.getItem("hospit-user");
    const requestOptionsPatient = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        rod_cislo: data.rod_cislo === "" ? null : data.rod_cislo,
        id_typu_ztp: data.type.ID_POSTIHNUTIA,
        datum_od: data.datum_od.toLocaleString("en-GB").replace(",", ""),
        datum_do:
          data.datum_do !== null
            ? data.datum_do.toLocaleString("en-GB").replace(",", "")
            : null,
      }),
    };
    await fetch("/add/typ_ztp", requestOptionsPatient)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "Úspešné pridanie postihnutia",
            life: 6000,
          });
        }
      })
      .then(() => (props.onInsert ? props.onInsert() : ""))
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

  const validate = (data) => {
    let errors = {};

    if (!data.datum_od) {
      errors.datum = "Dátum je povinný";
    }
    if (!data.type) {
      errors.popis = "Typ je povinný";
    }

    return errors;
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
              props.rod_cislo !== null || typeof props.rod_cislo !== "undefined"
                ? props.rod_cislo
                : "",
            type: null,
            datum_od: null,
            datum_do: null,
          }}
          validate={validate}
          render={({ handleSubmit }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
                name="rod_cislo"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="rod_cislo">Rodné číslo</label>
                    <InputMask
                      id="rod_cislo"
                      mask="999999/9999"
                      disabled={
                        props.rod_cislo !== null &&
                        typeof props.rod_cislo !== "undefined"
                          ? true
                          : false
                      }
                      {...input}
                    />
                  </div>
                )}
              />
              <Field
                name="type"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="type">Typ postihnutia*</label>
                    <Dropdown
                      id="type"
                      {...input}
                      options={types}
                      optionLabel="NAZOV"
                      filter
                    />
                  </div>
                )}
              />

              <Field
                name="datum_od"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="datum_od">Dátum od*</label>
                    <Calendar
                      id="basic"
                      {...input}
                      dateFormat="dd.mm.yy"
                      mask="99.99.9999"
                      showIcon
                      showTime
                    />
                  </div>
                )}
              />
              <Field
                name="datum_do"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="datum_do">Dátum do</label>
                    <Calendar
                      id="basic"
                      {...input}
                      dateFormat="dd.mm.yy"
                      mask="99.99.9999"
                      showIcon
                      showTime
                    />
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
