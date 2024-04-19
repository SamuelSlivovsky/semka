import React, { useEffect, useRef, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { Toast } from "primereact/toast";
export default function VacForm(props) {
  const toast = useRef(null);
  const [vaccines, setVaccines] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    fetch(`selects/typyOckovania`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setVaccines(data);
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
        id_vakciny: data.vac.ID_VAKCINY,
        datum: data.datum.toLocaleString("en-GB").replace(",", ""),
      }),
    };
    await fetch("/add/ockovanie", requestOptionsPatient)
      .then(async (response) => {
        if (!response.ok) {
          const errorMessage = await response.json();
          throw new Error(errorMessage.error);
        } else {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "Úspešné pridanie očkovania",
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
            vac: null,
            datum: null,
          }}
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
                name="vac"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="vac">Očkovanie*</label>
                    <Dropdown
                      id="vac"
                      {...input}
                      options={vaccines}
                      optionLabel="NAZOV"
                      filter
                    />
                  </div>
                )}
              />

              <Field
                name="datum"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="datum">Dátum očkovania*</label>
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
