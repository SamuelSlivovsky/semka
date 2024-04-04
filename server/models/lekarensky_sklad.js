const database = require("../database/Database");

async function getLiekyLekarenskySklad(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT l.nazov as "NAZOV_LIEKU", ul.nazov as "UCINNA_LATKA", tl.id_sklad, lek.nazov as "NAZOV_LEKARNE",
      to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tl.pocet as "POCET", l.na_predpis
      from trvanlivost_lieku tl
      join liek l on (l.id_liek = tl.id_liek)
      join ucinne_latky_liekov ull on (ull.id_liek = l.id_liek)
      join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
      join sklad ls on (ls.id_sklad = tl.id_sklad)
      right join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      where zam.cislo_zam = :id
      order by NAZOV_LIEKU, UCINNA_LATKA`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZdrPomockyLekarenskySklad(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT zp.nazov as "NAZOV_ZDR_POMOCKY", tzp.id_sklad, lek.nazov as "NAZOV_LEKARNE", ls.id_lekarne, 
      to_char(tzp.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tzp.pocet as "POCET"
      from trvanlivost_zdr_pomocky tzp
      join zdravotna_pomocka zp on (zp.id_zdr_pomocky = tzp.id_zdr_pomocky)
      join sklad ls on (ls.id_sklad = tzp.id_sklad)
      right join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      where zam.cislo_zam = :id
      order by NAZOV_ZDR_POMOCKY`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getSearchLiecivoLekarenskySklad() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT tl.id_liek, l.nazov as "NAZOV_LIEKU", ul.nazov as "UCINNA_LATKA", tl.id_sklad, lek.id_lekarne, lek.nazov as "NAZOV_LEKARNE",
      to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tl.pocet, l.na_predpis
      from liek l
      join ucinne_latky_liekov ull on (ull.id_liek = l.id_liek)
      join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
      join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
      join sklad ls on (ls.id_sklad = tl.id_sklad)
      join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      order by NAZOV_LEKARNE`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getSearchZdrPomockaLekarenskySklad() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT zp.nazov as "NAZOV_ZDR_POMOCKY", tzp.id_sklad, lek.nazov as "NAZOV_LEKARNE", ls.id_lekarne, 
      to_char(tzp.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tzp.pocet as "POCET"
      from zdravotna_pomocka zp
      join trvanlivost_zdr_pomocky tzp on (tzp.id_zdr_pomocky = zp.id_zdr_pomocky)
      join sklad ls on (ls.id_sklad = tzp.id_sklad)
      join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      order by NAZOV_LEKARNE`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getVolnyPredajLiekov(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT l.id_liek, l.nazov as "NAZOV_LIEKU", ul.nazov as "UCINNA_LATKA",
       tl.id_sklad, lek.id_lekarne, lek.nazov as "NAZOV_LEKARNE",
        to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS') as "DATUM_TRVANLIVOSTI", tl.pocet as "POCET"
        from liek l
        join ucinne_latky_liekov ull on (ull.id_liek = l.id_liek)
        join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
        join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
        join sklad ls on (ls.id_sklad = tl.id_sklad)
        right join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
        join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
        where l.na_predpis = 'N' and zam.cislo_zam = :id
        order by NAZOV_LIEKU`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function updatePocetVolnopredajnehoLieku(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE trvanlivost_lieku
    SET pocet = pocet - :vydanyPocet
    WHERE datum_trvanlivosti = TO_DATE(:datumTrvanlivosti, 'DD.MM.YYYY HH24:MI:SS')
    AND id_liek = :idLiek
    AND id_sklad IN (SELECT id_sklad FROM sklad WHERE id_lekarne = :idLekarne)
    AND pocet >= :vydanyPocet`;
    let result = await conn.execute(
      sqlStatement,
      {
        datumTrvanlivosti: body.datumTrvanlivosti,
        idLiek: body.idLiek,
        idLekarne: body.idLekarne,
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

module.exports = {
  getLiekyLekarenskySklad,
  getZdrPomockyLekarenskySklad,
  getSearchLiecivoLekarenskySklad,
  getSearchZdrPomockaLekarenskySklad,
  getVolnyPredajLiekov,
  updatePocetVolnopredajnehoLieku,
};
