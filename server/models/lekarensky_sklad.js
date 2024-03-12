const database = require("../database/Database");

async function getLiekyLekarenskySklad(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT l.nazov as "NAZOV_LIEKU", tl.id_sklad, lek.nazov as "NAZOV_LEKARNE", tl.id_lekarensky_sklad, 
      to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tl.pocet as "POCET", l.na_predpis
      from liek l
      join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tl.id_lekarensky_sklad)
      right join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      where zam.cislo_zam = :id
      order by NAZOV_LIEKU`,
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
      `select DISTINCT zp.nazov as "NAZOV_ZDR_POMOCKY", tzp.id_sklad, tzp.id_lekarensky_sklad, lek.nazov as "NAZOV_LEKARNE", ls.id_lekarne, 
      to_char(tzp.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tzp.pocet as "POCET"
      from zdravotna_pomocka zp
      join trvanlivost_zdr_pomocky tzp on (tzp.id_zdr_pomocky = zp.id_zdr_pomocky)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tzp.id_lekarensky_sklad)
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
      `select DISTINCT l.nazov as "NAZOV_LIEKU", tl.id_sklad, lek.nazov as "NAZOV_LEKARNE", tl.id_lekarensky_sklad, 
      to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tl.pocet, l.na_predpis
      from liek l
      join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tl.id_lekarensky_sklad)
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
      `select DISTINCT zp.nazov as "NAZOV_ZDR_POMOCKY", tzp.id_sklad, tzp.id_lekarensky_sklad, lek.nazov as "NAZOV_LEKARNE", ls.id_lekarne, 
      to_char(tzp.datum_trvanlivosti, 'DD.MM.YYYY') as "DATUM_TRVANLIVOSTI", tzp.pocet as "POCET"
      from zdravotna_pomocka zp
      join trvanlivost_zdr_pomocky tzp on (tzp.id_zdr_pomocky = zp.id_zdr_pomocky)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tzp.id_lekarensky_sklad)
      right join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      order by NAZOV_ZDR_POMOCKY`
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
      `select DISTINCT l.nazov as "NAZOV_LIEKU", tl.id_sklad, lek.nazov as "NAZOV_LEKARNE", tl.id_lekarensky_sklad, to_char(tl.datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS') as "DATUM_TRVANLIVOSTI", tl.pocet as "POCET"
      from liek l
      join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tl.id_lekarensky_sklad)
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

module.exports = {
  getLiekyLekarenskySklad,
  getZdrPomockyLekarenskySklad,
  getSearchLiecivoLekarenskySklad,
  getSearchZdrPomockaLekarenskySklad,
  getVolnyPredajLiekov,
};
