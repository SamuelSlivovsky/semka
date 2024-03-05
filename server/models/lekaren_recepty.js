const database = require("../database/Database");

async function getZoznamReceptov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select oupac.rod_cislo, oupac.meno as "MENO_PACIENTA", oupac.priezvisko as "PRIEZVISKO_PACIENTA", recept.id_receptu as "ID_RECEPTU",
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
    typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
    from recept
    join pacient on (pacient.id_pacienta = recept.id_pacienta)
    join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
    join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
    join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
    join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
    join liek on (liek.id_liek = recept.id_liek)`);
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
      to_char(recept.datum_zapisu, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_ZAPISU", to_char(recept.datum_prevzatia, 'DD.MM.YYYY HH24:MI:SS') AS "DATUM_PREVZATIA", liek.nazov as "NAZOV_LIEKU", recept.poznamka, recept.opakujuci,
      typ_zam.nazov as "TYP_ZAMESTNANCA", ouzam.meno as "MENO_LEKARA", ouzam.priezvisko as "PRIEZVISKO_LEKARA"
      from recept
      join pacient on (pacient.id_pacienta = recept.id_pacienta)
      join zamestnanci on (zamestnanci.cislo_zam = recept.cislo_zam)
      join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
      join os_udaje oupac on (oupac.rod_cislo = pacient.rod_cislo)
      join os_udaje ouzam on (ouzam.rod_cislo = zamestnanci.rod_cislo)
      join liek on (liek.id_liek = recept.id_liek)
      where recept.id_receptu = :id`,
      [id]
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getZoznamReceptov,
  getDetailReceptu,
};
