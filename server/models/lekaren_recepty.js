const database = require("../database/Database");

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

async function getDetailReceptu(id) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY') AS "DATUM_PREVZATIA",
      trvanlivost_lieku.id_liek as "ID_LIEKU", trvanlivost_lieku.datum_trvanlivosti, liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
      typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA",
      trvanlivost_lieku.pocet as "DOSTUPNY_POCET_NA_SKLADE", trvanlivost_lieku.id_sklad, lekaren.id_lekarne
      from recept
       left join pacient on (pacient.id_pacienta = recept.id_pacienta)
       left join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
       left join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
       left join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
       left join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
       left join liek on (liek.id_liek = recept.id_liek)
       left join trvanlivost_lieku on (trvanlivost_lieku.id_liek = liek.id_liek)
       left join sklad on (sklad.id_sklad = trvanlivost_lieku.id_sklad)
       left join lekaren on (lekaren.id_lekarne = sklad.id_lekarne)
      where recept.id_receptu = :id`,
      [id]
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

async function updateDatumZapisu(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE recept SET datum_prevzatia = to_date(:datum_prevzatia, 'YYYY-MM-DD')
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

module.exports = {
  getZoznamAktualnychReceptov,
  getZoznamVydanychReceptov,
  getDetailReceptu,
  updateDatumZapisu,
};
