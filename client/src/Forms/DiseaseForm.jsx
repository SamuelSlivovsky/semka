import React, { useEffect, useState } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
export default function DiseaseForm(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [diseaseTypes, setDiseaseTypes] = useState([]);
  const [diseases, setDiseases] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };

    fetch(`selects/typyChoroby`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDiseaseTypes(data);
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
        typ: data.type.TYP,
        nazov: data.name.NAZOV,
        datum_od: data.datum_od.toLocaleString("en-GB").replace(",", ""),
        datum_do: data.datum_do.toLocaleString("en-GB").replace(",", ""),
      }),
    };
    const responsePatient = await fetch(
      "/add/choroba",
      requestOptionsPatient
    ).then(() => setShowMessage(true));

    form.restart();
  };

  const dialogFooter = (
    <div className="flex justify-content-center">
      <Button
        label="OK"
        className="p-button-text"
        autoFocus
        onClick={() => {
          setShowMessage(false);
          props.hideDialog();
          props.onInsert();
        }}
      />
    </div>
  );

  const onDiseaseTypeChange = (e, input) => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    input.onChange(e.value);
    fetch(`selects/choroby/${e.value.TYP}`, { headers })
      .then((response) => response.json())
      .then((data) => {
        setDiseases(data);
      });
  };

  return (
    <div
      style={{ width: "100%", marginTop: "2rem" }}
      className="p-fluid grid formgrid"
    >
      <Dialog
        visible={showMessage}
        onHide={() => {
          setShowMessage(false);
        }}
        position="top"
        footer={dialogFooter}
        showHeader={false}
        breakpoints={{ "960px": "80vw" }}
        style={{ width: "30vw" }}
      >
        <div className="flex align-items-center flex-column pt-6 px-3">
          <i
            className="pi pi-check-circle"
            style={{ fontSize: "5rem", color: "var(--green-500)" }}
          ></i>
          <h5>Úspešné pridanie ochorenia</h5>
        </div>
      </Dialog>

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
            name: null,
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
                name="type"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="type">Typ ochorenia*</label>
                    <Dropdown
                      id="type"
                      {...input}
                      options={diseaseTypes}
                      onChange={(e) => onDiseaseTypeChange(e, input)}
                      optionLabel="TYP"
                      filter
                    />
                  </div>
                )}
              />
              <Field
                name="name"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label htmlFor="name">Názov ochorenia*</label>
                    <Dropdown
                      id="name"
                      {...input}
                      options={diseases}
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
                    <label htmlFor="datum_do">Dátum do*</label>
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
