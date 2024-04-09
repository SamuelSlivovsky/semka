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
  const [showOrderDialog, setShowOrderDialog] = useState(false);
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
        console.log(data[0].MENO_PACIENTA);
        console.log(data[0].PRIEZVISKO_PACIENTA);
        console.log(data[0].NAZOV_LEKARNE);
        console.log(data[0].MAZOV_LIEKU);
      });
  }, []); //

  const redirectToTabPrescriptions = () => {
    navigate("/prescriptions");
  };

  const redirectToObjednavky = () => {
    navigate("/objednavky");
  };

  const renderBackButton = () => {
    return (
      <div>
        <Button
          label="Späť na recepty"
          icon="pi pi-replay"
          style={{ marginTop: "10px", marginLeft: "10px" }}
          onClick={() => redirectToTabPrescriptions()}
        />
      </div>
    );
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${day}-${month}-${year}`;
  };

  const handleEditDate = () => {
    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    const formattedDate = formatDate(selectedDate);

    fetch(`pharmacyPrescriptions/updateDatumZapisu`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        id_receptu: detail.ID_RECEPTU,
        datum_prevzatia: formattedDate,
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "Dátum prevzatia bol úspešne aktualizovaný!",
            life: 6000,
          });
          decrementPocetNaSklade().then(() => {
            setShowEditDialog(false);
            setTimeout(() => {
              redirectToTabPrescriptions();
            }, 6000);
          });
        } else {
          // Handle error response
          res.json().then((errorData) => {
            toast.current.show({
              severity: "error",
              summary: "Chyba",
              detail:
                errorData.message ||
                "Nastala chyba pri aktualizácii dátumu prevzatia.",
              life: 6000,
            });
          });
        }
      })
      .catch((error) => {
        // V prípade chyby v sieti alebo inej chyby
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nepodarilo sa odoslať požiadavku.",
          life: 6000,
        });
      });
    fetch(`pharmacyPrescriptions/sendSMS`, {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        datum_prevzatia: formattedDate,
        nazov_lekarne: detail.NAZOV_LEKARNE,
        meno_pacienta: detail.MENO_PACIENTA,
        priezvisko_pacienta: detail.PRIEZVISKO_PACIENTA,
        nazov_lieku: detail.NAZOV_LIEKU,
      }),
    })
      .then((res) => {
        if (res.ok) {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "SMS notifikácia bola pacientovi úspeśne odoslaná!",
            life: 6000,
          });
        } else {
          // Handle error response
          res.json().then((errorData) => {
            toast.current.show({
              severity: "error",
              summary: "Chyba",
              detail:
                errorData.message ||
                "Nastala chyba pri odosielaní SMS notifikácie.",
              life: 6000,
            });
          });
        }
      })
      .catch((error) => {
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nepodarilo sa odoslať požiadavku.",
          life: 6000,
        });
      });
  };

  const decrementPocetNaSklade = async () => {
    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };
    try {
      await fetch(`pharmacyPrescriptions/updatePocetLiekuVydajReceptu`, {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          datum_trvanlivosti: detail.DATUM_TRVANLIVOSTI,
          id_liek: detail.ID_LIEKU,
          id_lekarne: detail.ID_LEKARNE,
          vydanyPocet: 1,
        }),
      });
      toast.current.show({
        severity: "success",
        summary: "Úspech",
        detail: "Počet na sklade bol úspešne aktualizovaný!",
        life: 6000,
      });
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Chyba",
        detail: "Nepodarilo sa aktualizovať počet na sklade.",
        life: 6000,
      });
    }
  };

  const tryEditDate = () => {
    if (detail.DOSTUPNY_POCET_NA_SKLADE === null) {
      // Ak je liek nedostupný, zobrazí upozornenie a nedovolí editáciu
      toast.current.show({
        severity: "warn",
        summary: "Liek na sklade nedostupný",
        detail: "Nemožno nastaviť dátum prevzatia receptu!",
        life: 6000,
      });
      setTimeout(() => {
        setShowOrderDialog(true);
      }, 6000);
    } else {
      // Ak je liek dostupný, povolí editáciu dátumu prevzatia
      setShowEditDialog(true);
    }
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
            className="p-button-rounded p-button-outlined p-button-raised p-button-warning"
            onClick={() => tryEditDate()}
          />
        </div>
      )}
    </div>
  );

  return (
    <div>
      {renderBackButton()}
      <div className="flex col-12">
        <Card
          className="col-5 shadow-4 text-center"
          style={{ width: "70rem", height: "50rem" }}
          title=<h3>ID receptu: {detail.ID_RECEPTU}</h3>
        >
          {renderDetail("Dátum zápisu: ", detail.DATUM_ZAPISU)}
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
          dateFormat="dd.mm.yy"
        />
      </Dialog>
      <Dialog
        visible={showOrderDialog}
        onHide={() => setShowOrderDialog(false)}
        header={"Chcete objednať liek " + detail.NAZOV_LIEKU + " ?"}
        footer={
          <div>
            <Button
              label="Zrušiť"
              icon="pi pi-times"
              onClick={() => setShowOrderDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Potvrdiť"
              icon="pi pi-check"
              onClick={() => redirectToObjednavky()}
            />
          </div>
        }
      ></Dialog>
      <Toast ref={toast} />
    </div>
  );
}
