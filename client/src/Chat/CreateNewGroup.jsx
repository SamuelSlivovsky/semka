import React, { useState, useEffect } from "react";
import { Form, Field } from "react-final-form";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { AutoComplete } from "primereact/autocomplete";
import { Calendar } from "primereact/calendar";
import GetUserData from "../Auth/GetUserData";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
export default function CreateNewGroup(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [doctors, setDoctors] = useState([]);
  const [filteredZaznamy, setFilteredZaznamy] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);

  useEffect(() => {
    getDoctors();
  }, []); // eslint-disable-line;

  const validate = (data) => {
    let errors = {};

    if (!data.lekari) {
      errors.lekari = "Lekári sú povinní";
    }
    if (!data.nazov) {
      errors.nazov = "Názov je povinný";
    } else if (data.nazov.length > 60) {
      errors.nazov = "Dĺžka názvu nesmie presiahnuť 60 znakov";
    }

    return errors;
  };

  const onSubmit = async (data, form) => {
    console.log("first");
    const token = localStorage.getItem("hospit-user");
    const userData = GetUserData(token);
    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        userid: userData.UserInfo.userid,
        lekari: data.lekari,
        nazov: data.nazov,
      }),
    };
    fetch(`/chat/new`, requestOptions);

    //form.restart();
  };

  const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
  const getFormErrorMessage = (meta) => {
    return (
      isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>
    );
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

  const getDoctors = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(`/lekar/kolegovia/${props.userDataHelper.UserInfo.userid}`, {
      headers,
    })
      .then((response) => response.json())
      .then((data) => {
        setDoctors(data);
      });
  };

  const searchDoctors = (event) => {
    setTimeout(() => {
      let _filtered;
      if (!event.query.trim().length) {
        _filtered = [...doctors];
      } else {
        _filtered = doctors.filter((doctor) => {
          return (
            doctor.LEKAR.toLowerCase().includes(event.query.toLowerCase()) ||
            doctor.CISLO_ZAM == event.query
          );
        });
      }

      setFilteredDoctors(_filtered);
    }, 250);
  };

  return (
    <div
      style={{ width: "100%", marginTop: "2rem", marginLeft: "10px" }}
      className="p-fluid grid formgrid"
    >
      <Dialog
        visible={showMessage}
        onHide={() => setShowMessage(false)}
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
          <h5>Úspešné odoslanie údajov</h5>
        </div>
      </Dialog>

      <div className="field col-12">
        <Form
          onSubmit={onSubmit}
          initialValues={{
            nazov: "",
            lekari: null,
          }}
          validate={validate}
          render={({ handleSubmit, form, values }) => (
            <form onSubmit={handleSubmit} className="p-fluid">
              <Field
                name="lekari"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="lekari"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Lekári*
                    </label>
                    <AutoComplete
                      {...input}
                      suggestions={filteredDoctors}
                      multiple
                      completeMethod={searchDoctors}
                      field="LEKAR"
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <Field
                name="nazov"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="nazov"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Názov*
                    </label>
                    <InputText
                      {...input}
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
