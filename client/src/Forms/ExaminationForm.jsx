import React, { useState, useRef } from "react";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputMask } from "primereact/inputmask";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { FileUpload } from "primereact/fileupload";
import GetUserData from "../Auth/GetUserData";
import { InputText } from "primereact/inputtext";
export default function ExaminationForm(props) {
  const [showMessage, setShowMessage] = useState(false);
  const [base64Data, setBase64Data] = useState(null);
  const fileUploader = useRef(null);

  const validate = (data) => {
    let errors = {};

    if (!data.datum) {
      errors.datum = "Dátum je povinný";
    }
    if (!data.popis) {
      errors.popis = "Popis je povinný";
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
        rod_cislo: data.rod_cislo === "" ? null : data.rod_cislo,
        datum: data.datum.toLocaleString("en-GB").replace(",", ""),
        popis: data.popis,
        id_lekara: userData.UserInfo.userid,
        priloha: base64Data,
        nazov: data.nazov,
      }),
    };
    const responsePatient = await fetch(
      "/add/vysetrenie",
      requestOptionsPatient
    ).then(() => setShowMessage(true));

    form.restart();
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
        onClick={() => {
          setShowMessage(false);
          props.hideDialog();
          props.onInsert();
        }}
      />
    </div>
  );

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
  return (
    <div
      style={{ width: "100%", marginTop: "2rem" }}
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
          <h5>Úspešné vytvorenie vyšetrenia</h5>
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
            datum: null,
            popis: "",
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
                      Rodné číslo
                    </label>
                    <InputMask
                      autoFocus
                      id="rod_cislo"
                      mask="999999/9999"
                      disabled={
                        props.rod_cislo !== null &&
                        typeof props.rod_cislo !== "undefined"
                          ? true
                          : false
                      }
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
                name="datum"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="datum"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Dátum vyšetrenia*
                    </label>
                    <Calendar
                      id="basic"
                      {...input}
                      dateFormat="dd.mm.yy"
                      mask="99.99.9999"
                      showIcon
                      showTime
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
                      id="nazov"
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
                name="popis"
                render={({ input, meta }) => (
                  <div className="field col-12">
                    <label
                      htmlFor="popis"
                      className={classNames({
                        "p-error": isFormFieldValid(meta),
                      })}
                    >
                      Popis*
                    </label>
                    <InputTextarea
                      id="popis"
                      rows={5}
                      cols={30}
                      autoResize
                      {...input}
                      className={classNames({
                        "p-invalid": isFormFieldValid(meta),
                      })}
                    />
                    {getFormErrorMessage(meta)}
                  </div>
                )}
              />
              <div className="field col-12 ">
                <label htmlFor="basic">Príloha</label>
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
                    <p className="m-0">
                      Drag and drop files to here to upload.
                    </p>
                  }
                />
              </div>

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
