import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { useNavigate, useLocation } from "react-router";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";

export default function PrescriptionCard(props) {
  const [detail, setDetail] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const toast = useRef(null); // Ref for Toast component
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    fetch(
      `pharmacyPrescriptions/detailReceptu/${
        typeof props.prescriptionId !== "undefined" &&
        props.prescriptionId !== null
          ? props.prescriptionId
          : location.state
      }`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetail(...data);
      });
  }, []); //

  const redirect = () => {
    navigate("/prescriptions");
  };

  const handleEditDate = () => {
    // Implement your logic to handle the edited date
    // For example, you can make a fetch request to update the date on the server
    // and then update the state or close the dialog
    // setDetail({ ...detail, DATUM_PREVZATIA: selectedDate });
    // setShowEditDialog(false);

    // Display a notification after saving
    toast.current.show({
      severity: "success",
      summary: "Úspech",
      detail: "Liek na recept bol úspešne vydaný!",
    });

    // Additional logic to send a notification to the patient
    //sendNotificationToPatient(); // Implement this function
  };

  const renderCardFooter = () => {
    return (
      <div>
        <Button
          label="Späť"
          icon="pi pi-replay"
          style={{ marginTop: 30 }}
          onClick={() => redirect()}
        />
      </div>
    );
  };

  const renderDetail = (label, value, isEditable = false) => (
    <div className="flex w-100">
      <div className="col-6 m-0">
        <h3 className="ml-10">{label}</h3>
      </div>
      <div className="col-4 m-0">
        <h4 style={{ color: "gray" }}>{value}</h4>
      </div>
      {isEditable && (
        <div className="col-2 m-0">
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            onClick={() => setShowEditDialog(true)}
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "70rem", height: "45rem" }}
          title=<h3>ID receptu: {detail.ID_RECEPTU}</h3>
        >
          {renderDetail("Dátum zapisu: ", detail.DATUM_ZAPISU)}
          {renderDetail("Liek na recept: ", detail.NAZOV_LIEKU)}
          {renderDetail("Poznámka: ", detail.POZNAMKA)}
          {renderDetail(
            "Recept vydal: ",
            detail.TYP_ZAMESTNANCA +
              ": " +
              detail.MENO_LEKARA +
              " " +
              detail.PRIEZVISKO_LEKARA
          )}
          {renderDetail("Opakujúci recept: ", detail.OPAKUJUCI)}
          {renderDetail("Dátum prevzatia: ", detail.DATUM_PREVZATIA, true)}
          {renderCardFooter()}
        </Card>
      </div>
      <div className="col-12 flex"></div>

      {/* Edit Date Dialog */}
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header="Nastaviť dátum prevzatia"
        footer={
          <div>
            <Button
              label="Zrušiť"
              icon="pi pi-times"
              onClick={() => setShowEditDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Potvrdiť"
              icon="pi pi-check"
              onClick={handleEditDate}
            />
          </div>
        }
      >
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value)}
          showIcon
          dateFormat="yy-mm-dd"
        />
      </Dialog>
      {/* Toast component for notifications */}
      <Toast ref={toast} />
    </div>
  );
}
