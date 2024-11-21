import React, { useEffect, useState, useRef } from "react";
import { Card } from "primereact/card";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { useNavigate, useLocation } from "react-router";
import GetUserData from "../Auth/GetUserData";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import { InputText } from "primereact/inputtext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";
import customFont from "../Fonts/Roboto/Roboto-Regular.ttf";

export default function PrescriptionCard(props) {
  const [detail, setDetail] = useState("");
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showOrderDialog, setShowOrderDialog] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [issuedCount, setIssuedCount] = useState(1);
  const toast = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const [celkovaSuma, setCelkovaSuma] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem("hospit-user");
    const headers = { authorization: "Bearer " + token };
    const userDataHelper = GetUserData(token);
    fetch(
      `pharmacyPrescriptions/detailReceptu/${
        typeof props.prescriptionId !== "undefined" &&
        props.prescriptionId !== null
          ? props.prescriptionId
          : location.state
      }/${userDataHelper.UserInfo.userid}`,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDetail(...data);
        console.log(data[0].MENO_PACIENTA);
        console.log(data[0].PRIEZVISKO_PACIENTA);
        console.log(data[0].TELEFON);
        console.log(data[0].NAZOV_LEKARNE);
        console.log(data[0].NAZOV_LIEKU);
      });
  }, []); //

  const redirectToTabPrescriptions = () => {
    navigate("/prescriptions");
  };

  const redirectToObjednavky = () => {
    navigate("/objednavky");
  };

  const redirectToSearchLiekSklady = () => {
    navigate("/lekarensky_sklad_vyhladavanieLiecivaPodlaLekarni");
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
    return `${day}.${month}.${year}`;
  };

  const allowedPhoneNumbers = ["+421907243074"];
  const isPhoneNumberAllowed = (phoneNumber) => {
    return allowedPhoneNumbers.includes(phoneNumber);
  };

  const handleEditDate = async () => {
    if (!selectedDate) {
      toast.current.show({
        severity: "warn",
        summary: "Chýbajúci dátum prevzatia",
        detail: "Prosím, nastavte dátum prevzatia lieku.",
        life: 6000,
      });
      return;
    }

    const token = localStorage.getItem("hospit-user");
    const headers = {
      Authorization: "Bearer " + token,
      "Content-Type": "application/json",
    };

    const formattedDate = formatDate(selectedDate);
    if (issuedCount <= 0 || issuedCount > detail.DOSTUPNY_POCET_NA_SKLADE) {
      toast.current.show({
        severity: "error",
        summary: "Neplatný počet lieku",
        detail: `Zadaný počet lieku je neplatný. Skontrolujte, či je v rozsahu 1 až ${detail.DOSTUPNY_POCET_NA_SKLADE}.`,
        life: 6000,
      });
      return;
    }

    // Aktualizácia dátumu zápisu
    try {
      const res = await fetch("pharmacyPrescriptions/updateDatumZapisu", {
        method: "POST",
        headers,
        body: JSON.stringify({
          id_receptu: detail.ID_RECEPTU,
          datum_prevzatia: formattedDate,
        }),
      });

      if (res.ok) {
        toast.current.show({
          severity: "success",
          summary: "Úspech",
          detail: "Dátum prevzatia bol úspešne aktualizovaný!",
          life: 6000,
        });
        decrementPocetNaSklade().then(() => {
          setShowEditDialog(false);
          generatePDF();
          setTimeout(() => {
            redirectToTabPrescriptions();
          }, 6000);
        });
      } else {
        const errorData = await res.json();
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail:
            errorData.message ||
            "Nastala chyba pri aktualizácii dátumu prevzatia.",
          life: 6000,
        });
      }
    } catch (error) {
      toast.current.show({
        severity: "error",
        summary: "Chyba",
        detail: "Nepodarilo sa odoslať požiadavku.",
        life: 6000,
      });
    }

    // Odoslanie SMS
    if (isPhoneNumberAllowed(detail.TELEFON)) {
      try {
        const res = await fetch("pharmacyPrescriptions/sendSMS", {
          method: "POST",
          headers,
          body: JSON.stringify({
            datum_prevzatia: formattedDate,
            nazov_lekarne: detail.NAZOV_LEKARNE,
            meno_pacienta: detail.MENO_PACIENTA,
            priezvisko_pacienta: detail.PRIEZVISKO_PACIENTA,
            nazov_lieku: detail.NAZOV_LIEKU,
            telefon: detail.TELEFON,
          }),
        });

        if (res.ok) {
          toast.current.show({
            severity: "success",
            summary: "Úspech",
            detail: "SMS notifikácia bola pacientovi úspešne odoslaná!",
            life: 6000,
          });
        } else {
          const errorData = await res.json();
          toast.current.show({
            severity: "error",
            summary: "Chyba",
            detail:
              errorData.message ||
              "Nastala chyba pri odosielaní SMS notifikácie.",
            life: 6000,
          });
        }
      } catch (error) {
        toast.current.show({
          severity: "error",
          summary: "Chyba",
          detail: "Nepodarilo sa odoslať požiadavku.",
          life: 6000,
        });
      }
    } else {
      toast.current.show({
        severity: "warn",
        summary: "Varovanie",
        detail:
          "Pacientove telefónne číslo nie je zaregistrované na odosielanie SMS.",
        life: 6000,
      });
    }
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
          vydanyPocet: issuedCount,
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

  jsPDF.API.events.push([
    "addFonts",
    function () {
      this.addFont(customFont, "Roboto", "normal");
    },
  ]);
  require("jspdf-autotable");
  const QRCode = require("qrcode");

  const generatePDF = async () => {
    const doc = new jsPDF();

    doc.setFont("Roboto", "normal");
    doc.setFontSize(16);
    doc.text(
      "Vydanie lieku na recept v lekárni",
      doc.internal.pageSize.getWidth() / 2,
      20,
      { align: "center" }
    );

    const qrData = JSON.stringify({
      idReceptu: detail.ID_RECEPTU,
      lekaren: detail.NAZOV_LEKARNE,
      liek: detail.NAZOV_LIEKU,
      jednotkovaCena: `${parseFloat(detail.JEDNOTKOVA_CENA).toFixed(2)} €`,
      vydajPocet: issuedCount,
      celkovaSuma: `${celkovaSuma.toFixed(2)} €`,
    });

    const qrCodeDataURL = await QRCode.toDataURL(qrData, {
      errorCorrectionLevel: "H",
    });

    doc.autoTable({
      startY: 30,
      head: [["Položka", "Informácia"]],
      body: [
        ["ID receptu", detail.ID_RECEPTU],
        ["Rodné číslo pacienta", detail.ROD_CISLO],
        [
          "Meno, priezvisko pacienta",
          detail.MENO_PACIENTA + " " + detail.PRIEZVISKO_PACIENTA,
        ],
        ["Lekáreň", detail.NAZOV_LEKARNE],
        ["Liek na recept", detail.NAZOV_LIEKU],
        ["Poznámka", detail.POZNAMKA],
        [
          "Jednotková cena",
          `${parseFloat(detail.JEDNOTKOVA_CENA).toFixed(2)} €`,
        ],
        ["Vydaný počet", issuedCount],
        ["Celková suma", `${celkovaSuma.toFixed(2)} €`],
      ],
      styles: {
        font: "Roboto",
        fontSize: 11,
        halign: "center",
      },
      headStyles: {
        fillColor: [22, 160, 133],
        halign: "center",
      },
      margin: { left: 10, right: 10 },
      columnStyles: {
        0: { cellWidth: "auto" },
        1: { cellWidth: "auto" },
      },
    });

    const qrCodeWidth = 50;
    const qrCodeHeight = 50;

    const pageHeight = doc.internal.pageSize.getHeight();
    const qrCodeX = (doc.internal.pageSize.getWidth() - qrCodeWidth) / 2;
    const qrCodeY = pageHeight - qrCodeHeight - 10;

    doc.addImage(
      qrCodeDataURL,
      "PNG",
      qrCodeX,
      qrCodeY,
      qrCodeWidth,
      qrCodeHeight
    );

    doc.save("vydanie_lieku_na_recept.pdf");
  };

  // Funkcia na výpočet celkovej sumy
  const calculateCelkovaSuma = () => {
    if (detail && issuedCount) {
      const cena = parseFloat(detail.JEDNOTKOVA_CENA);
      setCelkovaSuma(cena * parseFloat(issuedCount));
    } else {
      setCelkovaSuma(0);
    }
  };

  useEffect(() => {
    calculateCelkovaSuma();
  }, [issuedCount, detail]);

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
            label="Vydať liek na recept"
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
          <div
            style={{
              fontStyle: "italic",
              backgroundColor: "#d4ffec",
              borderRadius: "15px",
            }}
          >
            {!detail.DATUM_PREVZATIA &&
              renderDetail(
                "Aktuálny počet " + detail.NAZOV_LIEKU + " na sklade: ",
                detail.DOSTUPNY_POCET_NA_SKLADE === null
                  ? "Momentálne nedostupné"
                  : detail.DOSTUPNY_POCET_NA_SKLADE
              )}
          </div>
          {renderDetail("Dátum prevzatia: ", detail.DATUM_PREVZATIA, true)}
        </Card>
      </div>
      <div className="col-12 flex"></div>

      {/* Edit Date Dialog */}
      <Dialog
        visible={showEditDialog}
        onHide={() => setShowEditDialog(false)}
        header={
          <div
            style={{
              margin: "auto",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <h3
              style={{
                color: "#00796b",
                borderBottom: "2px solid #004d40",
                paddingBottom: "5px",
                marginBottom: "10px",
                fontWeight: "normal",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Vydanie lieku na recept v lekárni
            </h3>
            {detail.NAZOV_LEKARNE}
            <br />
            <h5>{detail.NAZOV_LIEKU}</h5>
            <h5>{parseFloat(detail.JEDNOTKOVA_CENA).toFixed(2)} €</h5>
            <div style={{ marginTop: "25px" }}>
              <span
                style={{
                  fontWeight: "lighter",
                  // backgroundColor: "#cafaea",
                  borderRadius: "15px",
                  padding: "0.5rem",
                  border: "#cafaea 5px solid",
                }}
              >
                Celková suma:
              </span>{" "}
              {celkovaSuma.toFixed(2)} €
            </div>
          </div>
        }
        style={{ width: "50vw" }}
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
        <div style={{ marginBottom: "1px", fontWeight: "normal" }}>
          Vydať počet
        </div>
        <InputText
          type="number"
          value={issuedCount}
          onChange={(e) => setIssuedCount(Number(e.target.value))}
          min="1"
          max={detail.DOSTUPNY_POCET_NA_SKLADE}
          style={{ marginTop: "10px", width: "100%" }}
          placeholder="Počet vydaných liekov"
        />
        <div
          style={{
            marginBottom: "1px",
            fontWeight: "normal",
            marginTop: "20px",
          }}
        >
          Nastaviť dátum prevzatia
        </div>
        <Calendar
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.value)}
          showIcon
          dateFormat="dd.mm.yy"
          style={{ marginTop: "5px", width: "100%" }}
        />
      </Dialog>
      <Dialog
        style={{ width: "900px" }}
        visible={showOrderDialog}
        onHide={() => setShowOrderDialog(false)}
        header={"Chcete objednať liek " + detail.NAZOV_LIEKU + "?"}
        footer={
          <div>
            <Button
              style={{ position: "absolute", display: "block" }}
              label="Zistiť dostupnosť v inej lekárni"
              icon="pi pi-verified"
              onClick={() => redirectToSearchLiekSklady()}
            />
            <Button
              label="Zrušiť"
              icon="pi pi-times"
              onClick={() => setShowOrderDialog(false)}
              className="p-button-text"
            />
            <Button
              label="Objednať v tejto lekárni"
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
