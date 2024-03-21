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
  const toast = useRef(null);
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

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const handleEditDate = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    console.log("first");
    const formattedDate = formatDate(selectedDate);

    fetch(`pharmacyPrescriptions/updateDatumZapisu`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        id_receptu: detail.ID_RECEPTU,
        datum_prevzatia: formattedDate,
      }),
    }).then((res) => {
      if (res.ok) {
        toast.current.show({
          severity: "success",
          summary: "Úspech",
          detail: "Dátum prevzatia bol úspešne aktualizovaný!",
        });
        setShowEditDialog(false);
        setTimeout(() => {
          redirect();
        }, 2000);
      } else {
        // Handle error response
        const errorData = res.json();
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nastala chyba pri aktualizácii dátumu prevzatia.",
        });
        throw new Error(errorData.message || "Error updating date");
      }
    });
  };

  const tryEditDate = () => {
    if (detail.DOSTUPNY_POCET_NA_SKLADE === null) {
      // Ak je liek nedostupný, zobrazí upozornenie a nedovolí editáciu
      toast.current.show({
        severity: "warn",
        summary: "Upozornenie",
        detail:
          "Dátum prevzatia nemožno editovať, pretože liek je na sklade momentálne nedostupný.",
        life: 5000,
      });
    } else {
      // Ak je liek dostupný, povolí editáciu dátumu prevzatia
      setShowEditDialog(true);
    }
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
      {isEditable && !detail.DATUM_PREVZATIA && (
        <div className="col-2 m-0">
          <Button
            icon="pi pi-pencil"
            className="p-button-rounded p-button-warning"
            onClick={() => tryEditDate()}
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
          style={{ width: "70rem", height: "55rem" }}
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
          {!detail.DATUM_PREVZATIA &&
            renderDetail(
              "Aktuálny počet " + detail.NAZOV_LIEKU + " na sklade: ",
              detail.DOSTUPNY_POCET_NA_SKLADE === null
                ? "Momentálne nedostupné"
                : detail.DOSTUPNY_POCET_NA_SKLADE
            )}
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
              onClick={() => handleEditDate()}
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
      <Toast ref={toast} />
    </div>
  );
}
