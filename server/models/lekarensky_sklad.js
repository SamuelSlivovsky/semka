const database = require("../database/Database");

async function getLiekyLekarenskySklad(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select DISTINCT l.nazov as "nazov_lieku", tl.id_sklad, lek.nazov as "nazov_lekarne", tl.id_lekarensky_sklad, tl.datum_trvanlivosti, tl.pocet
      from liek l
      join trvanlivost_lieku tl on (tl.id_liek = l.id_liek)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tl.id_lekarensky_sklad)
      join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      where tl.id_lekarensky_sklad is not null and lek.id_lekarne = :id`,
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
      `select DISTINCT zp.nazov as "NAZOV_ZDR_POMOCKY", tzp.id_sklad, tzp.id_lekarensky_sklad, lek.nazov as "NAZOV_LEKARNE", ls.id_lekarne, to_char(tzp.datum_trvanlivosti, 'DD.MM.YYYY HH24:MI:SS') as "DATUM_TRVANLIVOSTI", tzp.pocet as "POCET"
      from zdravotna_pomocka zp
      join trvanlivost_zdr_pomocky tzp on (tzp.id_zdr_pomocky = zp.id_zdr_pomocky)
      join lekarensky_sklad ls on (ls.id_lekarensky_sklad = tzp.id_lekarensky_sklad)
      join lekaren lek on (lek.id_lekarne = ls.id_lekarne)
      join zamestnanci zam on (zam.id_lekarne = lek.id_lekarne)
      where tzp.id_lekarensky_sklad is not null and zam.cislo_zam = :id`,
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
};
