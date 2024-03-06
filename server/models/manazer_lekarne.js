const database = require("../database/Database");

async function getManazeriLekarni() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select cislo_zam, rod_cislo, meno, priezvisko, id_typ, zamestnanci.id_lekarne, lekaren.nazov as "LEKAREN_NAZOV", mesto.nazov as "MESTO_NAZOV"
        from zamestnanci 
        join os_udaje using (rod_cislo)
        join lekaren on (zamestnanci.id_lekarne = lekaren.id_lekarne)
        join mesto on (mesto.PSC = lekaren.PSC)
        where zamestnanci.id_typ = 10
        order by meno, priezvisko`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getLekarnici(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select distinct zl.cislo_zam, zl.rod_cislo, ol.meno, ol.priezvisko, zl.id_typ, zl.id_lekarne, ll.nazov as "LEKAREN_NAZOV", ml.nazov as "MESTO_NAZOV"
        from zamestnanci zl
        join os_udaje ol on (ol.rod_cislo = zl.rod_cislo)
        join lekaren ll on (zl.id_lekarne = ll.id_lekarne)
        join mesto ml on (ml.PSC = ll.PSC)
        join zamestnanci zml on (zml.id_lekarne = zl.id_lekarne)
        where zl.id_typ = 9 and zml.cislo_zam = :id
        order by meno, priezvisko`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getManazerLekarneInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
        || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia, zamestnanci.cislo_zam, PSC, mesto.nazov as nazov_obce from zamestnanci
                    join os_udaje on(os_udaje.rod_cislo = zamestnanci.rod_cislo) 
                    join mesto using(PSC) 
                      where zamestnanci.cislo_zam = :id`,
      [id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getLekarniciInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
        || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia,zamestnanci.cislo_zam, PSC, mesto.nazov as nazov_obce from zamestnanci
                    join os_udaje on(os_udaje.rod_cislo = zamestnanci.rod_cislo) 
                    join mesto using(PSC) 
                      where zamestnanci.cislo_zam = :id`,
      [id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPouzivatelInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.meno, os_udaje.priezvisko, os_udaje.rod_cislo, os_udaje.ulica, os_udaje.PSC, mesto.nazov as "NAZOV_MESTA", okres.nazov_okresu,
      kraj.nazov_kraja, zamestnanci.cislo_zam, zamestnanci.id_typ, to_char(zamestnanci.dat_od, 'DD.MM.YYYY HH24:MI:SS') AS "DAT_OD", typ_zam.nazov as "NAZOV_ROLE", lekaren.nazov as "NAZOV_LEKARNE"
      from zamestnanci
      join os_udaje on (os_udaje.rod_cislo = zamestnanci.rod_cislo)
      join mesto on (mesto.PSC = os_udaje.PSC)
      join okres on (okres.id_okresu = mesto.id_okresu)
      join kraj on (kraj.id_kraja = okres.id_kraja)
      join typ_zam on (typ_zam.id_typ = zamestnanci.id_typ)
      join lekaren on (lekaren.id_lekarne = zamestnanci.id_lekarne)
      where zamestnanci.cislo_zam = :id`,
      [id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZoznamLiekov() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`select l.nazov as "NAZOV_LIEKU", l.id_liek, l.ATC,
      ul.nazov as "NAZOV_UCINNEJ_LATKY", ul.latinsky_nazov, ul.id_ucinna_latka
    from ucinne_latky_liekov ull
    join liek l on (l.id_liek = ull.id_liek)
    join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
    order by NAZOV_LIEKU`);
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailLieku(id) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `select l.nazov as "NAZOV_LIEKU", l.typ, l.davkovanie, l.mnozstvo,
      ul.nazov as "NAZOV_UCINNEJ_LATKY", ul.latinsky_nazov, ul.id_ucinna_latka
    from ucinne_latky_liekov ull
    join liek l on (l.id_liek = ull.id_liek)
    join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
    where l.id_liek = :id`,
      [id]
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZoznamZdravotnickychPomocok() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select * from zdravotna_pomocka order by nazov`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailZdravotnickejPomocky(id) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `select nazov, doplnok_nazvu from zdravotna_pomocka where id_zdr_pomocky = :id`,
      [id]
    );

    return detail.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getReportInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select distinct count(distinct zl.cislo_zam) as "POCET_ZAMESNTNACOV", 
      count(distinct tzp.datum_trvanlivosti) as "POCET_ZDR_POMOCOK_V_LEK_SKLADE", 
      count(distinct tl.datum_trvanlivosti) as "POCET_LIEKOV_V_LEK_SKLADE",
      l.nazov as "NAZOV_LEKARNE"
      from zamestnanci zm
      left join lekaren l on (l.id_lekarne = zm.id_lekarne)
      left join zamestnanci zl on (zl.id_lekarne = l.id_lekarne)
      left join lekarensky_sklad ls on (ls.id_lekarne = l.id_lekarne)
      left join trvanlivost_zdr_pomocky tzp on (tzp.id_lekarensky_sklad = ls.id_lekarensky_sklad)
      left join trvanlivost_lieku tl on (tl.id_lekarensky_sklad = ls.id_lekarensky_sklad)
      where zl.id_typ = 9 and zm.id_typ = 10 and zm.cislo_zam = :id
      group by zm.cislo_zam, l.nazov`,
      [id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getManazeriLekarni,
  getLekarnici,
  getManazerLekarneInfo,
  getLekarniciInfo,
  getPouzivatelInfo,
  getZoznamLiekov,
  getDetailLieku,
  getZoznamZdravotnickychPomocok,
  getDetailZdravotnickejPomocky,
  getReportInfo,
};
