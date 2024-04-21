const database = require("../database/Database");

const client = require("twilio")(
  process.env.ACCOUNT_SID,
  process.env.AUTH_TOKEN_NOTIFICATION
);

async function getZoznamAktualnychReceptov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
    typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
    from recept
    join pacient on (pacient.id_pacienta = recept.id_pacienta)
    join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
    join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
    join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
    join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
    join liek on (liek.id_liek = recept.id_liek)
    where recept.datum_prevzatia is NULL
    order by ID_RECEPTU`);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZoznamVydanychReceptov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
    typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
    from recept
    join pacient on (pacient.id_pacienta = recept.id_pacienta)
    join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
    join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
    join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
    join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
    join liek on (liek.id_liek = recept.id_liek)
    where recept.datum_prevzatia is NOT NULL
    order by ID_RECEPTU`);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailReceptu(idReceptu, cisloZam) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `SELECT 
      oupac.rod_cislo, 
      oupac.meno AS "MENO_PACIENTA", 
      oupac.priezvisko AS "PRIEZVISKO_PACIENTA", 
      recept.id_receptu AS "ID_RECEPTU",
      TO_CHAR(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", 
      TO_CHAR(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA",
      liek.id_liek AS "ID_LIEKU", 
      TO_CHAR(trvanlivost_lieku.datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_TRVANLIVOSTI", 
      liek.nazov AS "NAZOV_LIEKU", 
      recept.poznamka, 
      recept.opakujuci,
      typ_zam.nazov AS "TYP_ZAMESTNANCA", 
      ouzam.meno AS "MENO_LEKARA", 
      ouzam.priezvisko AS "PRIEZVISKO_LEKARA",
      trvanlivost_lieku.pocet AS "DOSTUPNY_POCET_NA_SKLADE",
      trvanlivost_lieku.id_sklad, 
      lekaren.id_lekarne, 
      lekaren.nazov AS "NAZOV_LEKARNE",
      oupac.email AS "EMAIL", 
      oupac.telefon AS "TELEFON"
  FROM recept
  LEFT JOIN pacient ON pacient.id_pacienta = recept.id_pacienta
  LEFT JOIN zamestnanci ON zamestnanci.cislo_zam = recept.cislo_zam
  LEFT JOIN typ_zam ON typ_zam.id_typ = zamestnanci.id_typ
  LEFT JOIN os_udaje oupac ON oupac.rod_cislo = pacient.rod_cislo
  LEFT JOIN os_udaje ouzam ON ouzam.rod_cislo = zamestnanci.rod_cislo
  LEFT JOIN liek ON liek.id_liek = recept.id_liek
  LEFT JOIN trvanlivost_lieku ON trvanlivost_lieku.id_liek = liek.id_liek AND trvanlivost_lieku.id_sklad IN 
      (SELECT sklad.id_sklad 
       FROM sklad 
       JOIN lekaren ON lekaren.id_lekarne = sklad.id_lekarne 
       JOIN zamestnanci ON lekaren.id_lekarne = zamestnanci.id_lekarne 
       WHERE zamestnanci.cislo_zam = :cisloZam)
  LEFT JOIN sklad ON sklad.id_sklad = trvanlivost_lieku.id_sklad
  LEFT JOIN lekaren ON lekaren.id_lekarne = sklad.id_lekarne
  WHERE recept.id_receptu = :idReceptu`,
      {
        idReceptu,
        cisloZam,
      }
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

async function updateDatumZapisu(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE recept SET datum_prevzatia = to_date(:datum_prevzatia, 'DD.MM.YY')
    where id_receptu = :id_receptu`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        datum_prevzatia: body.datum_prevzatia,
        id_receptu: body.id_receptu,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function updatePocetLiekuVydajReceptu(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE trvanlivost_lieku
    SET pocet = pocet - :vydanyPocet
    WHERE datum_trvanlivosti = TO_DATE(:datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS')
    AND id_liek = :id_liek
    AND id_sklad IN (SELECT id_sklad FROM sklad WHERE id_lekarne = :id_lekarne)
    AND pocet >= :vydanyPocet`;
    let result = await conn.execute(
      sqlStatement,
      {
        datum_trvanlivosti: body.datum_trvanlivosti,
        id_liek: body.id_liek,
        id_lekarne: body.id_lekarne,
        vydanyPocet: body.vydanyPocet,
      },
      { autoCommit: true }
    );

    console.log("Rows updated " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function sendSMS(body) {
  console.log(body);
  try {
    client.messages
      .create({
        body:
          "Vážený pán/Vážená pani: " +
          body.meno_pacienta +
          " " +
          body.priezvisko_pacienta +
          ", liek na recept " +
          body.nazov_lieku +
          " bol vybratý v lekárni " +
          body.nazov_lekarne +
          " dňa " +
          body.datum_prevzatia,
        to: body.telefon,
        from: "+13344234063", // From a valid Twilio number
      })
      .then((message) => console.log(message.sid));
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

module.exports = {
  getZoznamAktualnychReceptov,
  getZoznamVydanychReceptov,
  getDetailReceptu,
  updateDatumZapisu,
  updatePocetLiekuVydajReceptu,
  sendSMS,
};
