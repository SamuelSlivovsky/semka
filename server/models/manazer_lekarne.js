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

async function insertZamestnanecLekarne(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    insert_zamestnanec_lekarne(:p_rod_cislo, :p_meno, :p_priezvisko, :p_psc, :p_ulica, :p_id_lekarne);
  END;`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        p_rod_cislo: body.rod_cislo,
        p_meno: body.meno,
        p_priezvisko: body.priezvisko,
        p_psc: body.psc,
        p_ulica: body.ulica,
        p_id_lekarne: body.id_lekarne,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function getLaboranti(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select distinct zl.cislo_zam, zl.rod_cislo, ol.meno, ol.priezvisko, zl.id_typ, zl.id_lekarne, ll.nazov as "LEKAREN_NAZOV", ml.nazov as "MESTO_NAZOV"
        from zamestnanci zl
        join os_udaje ol on (ol.rod_cislo = zl.rod_cislo)
        join lekaren ll on (zl.id_lekarne = ll.id_lekarne)
        join mesto ml on (ml.PSC = ll.PSC)
        join zamestnanci zml on (zml.id_lekarne = zl.id_lekarne)
        where zl.id_typ = 8 and zml.cislo_zam = :id
        order by meno, priezvisko`,
      [id]
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertLaborantLekarne(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    insert_laborant_lekarne(:p_rod_cislo, :p_meno, :p_priezvisko, :p_psc, :p_ulica, :p_id_lekarne);
  END;`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        p_rod_cislo: body.rod_cislo,
        p_meno: body.meno,
        p_priezvisko: body.priezvisko,
        p_psc: body.psc,
        p_ulica: body.ulica,
        p_id_lekarne: body.id_lekarne,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function deleteZamestnanciLekarne(cisloZam) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    delete_zamestnanec_lekarne(:p_cislo_zam);
  END;`;
    console.log(cisloZam);
    let result = await conn.execute(sqlStatement, [cisloZam], {
      autoCommit: true,
    });

    console.log("Rows deleted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function getManazerLekarneInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
        || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia, zamestnanci.cislo_zam, PSC, mesto.nazov as nazov_obce,
        os_udaje.telefon, os_udaje.email
        from zamestnanci 
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
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia,zamestnanci.cislo_zam, PSC, mesto.nazov as nazov_obce,
        os_udaje.telefon, os_udaje.email
        from zamestnanci
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

async function getLaborantiInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
        || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
        || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia,zamestnanci.cislo_zam, PSC, mesto.nazov as nazov_obce,
        os_udaje.telefon, os_udaje.email
        from zamestnanci
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
      `select os_udaje.meno, os_udaje.priezvisko, os_udaje.rod_cislo, os_udaje.ulica, os_udaje.PSC, os_udaje.telefon, os_udaje.email,
      mesto.nazov as "NAZOV_MESTA", okres.nazov_okresu,
      kraj.nazov_kraja, zamestnanci.cislo_zam, zamestnanci.id_typ, to_char(zamestnanci.dat_od, 'DD.MM.YYYY') AS "DAT_OD", typ_zam.nazov as "NAZOV_ROLE", lekaren.nazov as "NAZOV_LEKARNE"
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
    const result = await conn.execute(
      `select l.nazov as "NAZOV_LIEKU", l.id_liek, l.ATC,ul.nazov as "NAZOV_UCINNEJ_LATKY", ul.latinsky_nazov, ul.id_ucinna_latka, l.na_predpis
      from  liek l 
      left join ucinne_latky_liekov ull on (ull.id_liek = l.id_liek)
      left join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
      order by NAZOV_LIEKU`
    );
    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDetailLieku(id) {
  try {
    let conn = await database.getConnection();
    const detail = await conn.execute(
      `select l.nazov as "NAZOV_LIEKU", l.id_liek, l.ATC,ul.nazov as "NAZOV_UCINNEJ_LATKY", l.typ, l.davkovanie, l.mnozstvo,
      ul.latinsky_nazov, ul.id_ucinna_latka, l.na_predpis
      from  liek l 
      left join ucinne_latky_liekov ull on (ull.id_liek = l.id_liek)
      left join ucinna_latka ul on (ul.id_ucinna_latka = ull.id_ucinna_latka)
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
      `select distinct NAZOV_LEKARNE, (POCET_MANAZEROV + POCET_LEKARNIKOV + POCET_LABORANTOV) as "CELKOVY_POCET_ZAMESTNANCOV", 
      POCET_MANAZEROV, POCET_LEKARNIKOV, POCET_LABORANTOV, POCET_ZDR_POMOCOK, POCET_LIEKOV, POCET_LIEKOV_VOLNY, POCET_LIEKOV_PREDPIS
      from
      (
          select l.id_lekarne, l.nazov as "NAZOV_LEKARNE",
          count(distinct manazer.cislo_zam) as "POCET_MANAZEROV",
          count(distinct lekarnik.cislo_zam) as "POCET_LEKARNIKOV",
          count(distinct laborant.cislo_zam) as "POCET_LABORANTOV",
          count(distinct tzp.datum_trvanlivosti) as "POCET_ZDR_POMOCOK",
          count(distinct tl.datum_trvanlivosti) as "POCET_LIEKOV",
          count(distinct volnopredajny.id_liek) as "POCET_LIEKOV_VOLNY",
          count(distinct predpis.id_liek) as "POCET_LIEKOV_PREDPIS"
          from lekaren l
          left join zamestnanci manazer on (manazer.id_lekarne = l.id_lekarne)
          left join zamestnanci lekarnik on (lekarnik.id_lekarne = l.id_lekarne and lekarnik.id_typ = 9)
          left join zamestnanci laborant on (laborant.id_lekarne = l.id_lekarne and laborant.id_typ = 8)
          left join sklad ls on (ls.id_lekarne = l.id_lekarne)
          left join trvanlivost_zdr_pomocky tzp on (tzp.id_sklad = ls.id_sklad)
          left join trvanlivost_lieku tl on (tl.id_sklad = ls.id_sklad)
          left join trvanlivost_lieku tlv on (tlv.id_sklad = ls.id_sklad)
          left join liek volnopredajny on (volnopredajny.id_liek = tlv.id_liek and volnopredajny.na_predpis = 'N')
          left join trvanlivost_lieku tlp on (tlp.id_sklad = ls.id_sklad)
          left join liek predpis on (predpis.id_liek = tlp.id_liek and predpis.na_predpis = 'A')
          where manazer.cislo_zam = :id
          group by l.id_lekarne, l.nazov)`,
      [id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getUcinnaLatka() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select id_ucinna_latka, nazov, latinsky_nazov from ucinna_latka`
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertUcinneLatky(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    insert_ucinna_latka(:p_nazov, :p_latinsky_nazov);
  END;`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        p_nazov: body.nazov,
        p_latinsky_nazov: body.latinsky_nazov,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function updateUcinnaLatka(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `UPDATE ucinne_latky_liekov 
    SET id_ucinna_latka = :id_ucinna_latka
    WHERE id_liek = :id_liek`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        id_ucinna_latka: body.id_ucinna_latka,
        id_liek: body.id_liek,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function insertUcinnaLatka(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `insert into ucinne_latky_liekov
    values(:id_liek, :id_ucinna_latka)`;
    console.log(body);
    let result = await conn.execute(
      sqlStatement,
      {
        id_ucinna_latka: body.id_ucinna_latka,
        id_liek: body.id_liek,
      },
      { autoCommit: true }
    );

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function deleteUcinnaLatka(ucinnaLatka) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    delete_ucinna_latka(:ucinnaLatka);
  END;`;
    console.log(ucinnaLatka);
    let result = await conn.execute(sqlStatement, [ucinnaLatka], {
      autoCommit: true,
    });

    console.log("Rows deleted " + result.rowsAffected);
  } catch (err) {
    console.log("Err Model");
    console.log(err);
  }
}

async function getZoznamMiest() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select PSC, nazov from mesto order by nazov`
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getManazeriLekarni,
  getLekarnici,
  insertZamestnanecLekarne,
  getLaboranti,
  insertLaborantLekarne,
  deleteZamestnanciLekarne,
  getManazerLekarneInfo,
  getLekarniciInfo,
  getLaborantiInfo,
  getPouzivatelInfo,
  getZoznamLiekov,
  getDetailLieku,
  getZoznamZdravotnickychPomocok,
  getDetailZdravotnickejPomocky,
  getReportInfo,
  getUcinnaLatka,
  insertUcinneLatky,
  updateUcinnaLatka,
  insertUcinnaLatka,
  deleteUcinnaLatka,
  getZoznamMiest,
};
