const { element } = require("xml");
const database = require("../database/Database");

async function getZoznamLekarov(id) {
  try {
    let conn = await database.getConnection();

    const result = await conn.execute(
      `SELECT cislo_zam ,meno || ', ' ||priezvisko as "meno", oddelenie.typ_oddelenia as oddelenie_nazov, nemocnica.nazov as nemocnica_nazov, cislo_zam
      from  zamestnanci
                    join os_udaje using(rod_cislo)
                    join nemocnica on(zamestnanci.id_nemocnice = nemocnica.id_nemocnice)
                    left join oddelenie on(zamestnanci.id_oddelenia = oddelenie.id_oddelenia)
                    where (id_typ = 1 OR id_typ = 2 OR id_typ = 3)
                    AND nemocnica.id_nemocnice in (select id_nemocnice from zamestnanci where cislo_zam = :id)
                    AND cislo_zam <> :id`,
      [id, id]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getLekari(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const id_oddelenia = await conn.execute(
      `SELECT id_oddelenia from zamestnanci where cislo_zam = :pid_lekara`,
      { pid_lekara }
    );
    let id_odd = id_oddelenia.rows[0].ID_ODDELENIA;
    const result = await conn.execute(
      `SELECT typ_zam.nazov as profesia, meno, priezvisko, oddelenie.typ_oddelenia as oddelenie_nazov, nemocnica.nazov as nemocnica_nazov, zamestnanci.cislo_zam 
          from zamestnanci
                    join typ_zam using (id_typ)
                    join os_udaje using(rod_cislo)
                    join nemocnica using(id_nemocnice)
                    left join oddelenie on(zamestnanci.id_oddelenia = oddelenie.id_oddelenia)
              where oddelenie.id_oddelenia = :id_odd and id_typ in (1,3)`,
      { id_odd }
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPacienti(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT id_pacienta, meno, rod_cislo, priezvisko, rod_cislo || ' - ' || meno || ', ' || priezvisko as requestName,
       psc, id_poistenca, nazov,
      CASE WHEN id_hosp IS NOT NULL and (dat_do is null or dat_do >= sysdate) and dat_od <= sysdate THEN  1 ELSE 0 END AS je_hospit
FROM (
   SELECT p.id_pacienta, o.meno, p.rod_cislo, o.priezvisko, o.psc, h.id_hosp, h.dat_do, h.dat_od, id_poistenca, poistovna.nazov,
          ROW_NUMBER() OVER (PARTITION BY p.id_pacienta ORDER BY h.dat_do DESC NULLS FIRST) AS rn_hosp
   FROM pacient p
   LEFT JOIN zdravotna_karta zk ON zk.id_pacienta = p.id_pacienta
   LEFT JOIN zdravotny_zaz z ON z.id_karty = zk.id_karty AND TRUNC(z.datum) <= TRUNC(SYSDATE)
   LEFT JOIN hospitalizacia h ON h.id_zaznamu = z.id_zaznamu
   JOIN os_udaje o ON p.rod_cislo = o.rod_cislo
   JOIN nemocnica USING (id_nemocnice)
   JOIN zamestnanci USING (id_nemocnice)
   LEFT JOIN poistenie on (p.id_pacienta = poistenie.id_pacienta)
   LEFT join poistovna using (ICO)
   WHERE zamestnanci.cislo_zam = :pid_lekara
) sub
WHERE rn_hosp = 1
ORDER BY je_hospit desc

`,
      { pid_lekara }
    );
    return result.rows;
  } catch (err) {
      throw new Error("Database error: " + err);
    console.log(err);
  }
}

async function getPriemernyVek() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select 
                (select sum(vek) from
                (select extract(year from sysdate) - extract(year from datum_narodenia) as vek
                from (select to_date(substr(rod_cislo, 5, 2) || '.' || (case when substr(rod_cislo, 3, 1) = '5' then '0' when substr(rod_cislo, 3, 1) = '6' then '1' end) 
                || substr(rod_cislo, 4, 1) ||  '.19' || substr(rod_cislo, 1, 2), 'DD.MM.YYYY') as datum_narodenia
                from os_udaje join zamestnanci using(rod_cislo)))) /
                (select count(distinct cislo_zam) from zamestnanci) as priemerny_vek
             from dual`
        );
        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getUdalosti(id) {
  try {
    let udalosti = [];

    let operacie = await getOperacie(id);
    console.log(operacie);
    operacie.forEach((element) => {
      udalosti.push(element);
    });

    let vysetrenia = await getVysetrenia(id);
    console.log(vysetrenia);
    vysetrenia.forEach((element) => {
      udalosti.push(element);
    });

    let hospitalizacie = await getHospitalizacie(id);
    hospitalizacie.forEach((element) => {
      udalosti.push(element);
    });

    let konzilia = await getKonzilia(id);
    konzilia.forEach((element) => {
      udalosti.push(element);
    });

        return udalosti;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getOperacie(id) {
  try {
    let conn = await database.getConnection();
    const operacie = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(dat_operacie,'YYYY-MM-DD') || 'T' || to_char(dat_operacie, 'HH24:MI:SS') as "start",id_operacie as "id" ,id_zaznamu as "id_zaz", to_char(dat_operacie,'DD.MM.YYYY') datum from zdravotny_zaz
                join operacia using(id_zaznamu)
                  join zdravotna_karta using(id_karty)
                    join pacient using(id_pacienta)
                      join os_udaje using(rod_cislo) where cislo_zam = :id`,
      [id]
    );

    operacie.rows.forEach((element) => {
      element.type = "OPE";
    });

        return operacie.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getOperacieAdmin() {
  try {
    let conn = await database.getConnection();
    const operacie = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start",id_operacie as "id" ,id_zaznamu as "id_zaz", to_char(datum,'DD.MM.YYYY') datum from zdravotny_zaz
                join operacia using(id_zaznamu)
                  join zdravotna_karta using(id_karty)
                    join pacient using(id_pacienta)
                        join os_udaje using(rod_cislo)`
    );

    operacie.rows.forEach((element) => {
      element.type = "OPE";
    });

        return operacie.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getVysetrenia(id) {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(vysetrenie.datum,'YYYY-MM-DD') || 'T' || to_char(vysetrenie.datum, 'HH24:MI:SS') as "start", to_char(vysetrenie.datum,'DD.MM.YYYY') datum,
      id_zaznamu as "id_zaz" from vysetrenie
        join zdravotny_zaz using(id_zaznamu)
            join zdravotna_karta using(id_karty)
                 join pacient using(id_pacienta)
                  join os_udaje using(rod_cislo) 
                   where cislo_zam = :id
                   order by vysetrenie.datum desc`,
      [id]
    );

    vysetrenia.rows.forEach((element) => {
      element.type = "VYS";
    });

        return vysetrenia.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getVysetreniaAdmin() {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(zdravotny_zaz.datum,'YYYY-MM-DD') || 'T' || to_char(zdravotny_zaz.datum, 'HH24:MI:SS') as "start", to_char(zdravotny_zaz.datum,'DD.MM.YYYY') datum,
      id_zaznamu as "id_zaz" from vysetrenie
        join zdravotny_zaz using(id_zaznamu)
            join zdravotna_karta using(id_karty)
                 join pacient using(id_pacienta)
                  join os_udaje using(rod_cislo)`
    );

    vysetrenia.rows.forEach((element) => {
      element.type = "VYS";
    });

        return vysetrenia.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getHospitalizacie(id) {
  try {
    let conn = await database.getConnection();
    const hospitalizacie = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko, to_char(hospitalizacia.dat_od,'YYYY-MM-DD') || 'T' || to_char(hospitalizacia.dat_od, 'HH24:MI:SS') 
            as "start",id_zaznamu as "id_zaz", to_char(hospitalizacia.dat_od,'DD.MM.YYYY') || '-' || nvl(to_char(hospitalizacia.dat_do,'DD.MM.YYYY'),'Neukončená') datum,
            hospitalizacia.dat_do, hospitalizacia.id_hosp, hospitalizacia.prepustacia_sprava, hospitalizacia.dat_od
       from hospitalizacia
        join zdravotny_zaz using(id_zaznamu)
          join zdravotna_karta using(id_karty)
                 join pacient using(id_pacienta)
                  join os_udaje on(os_udaje.rod_cislo = pacient.rod_cislo) 
                  join lozko using(id_lozka)
                  join miestnost on (lozko.id_miestnost = miestnost.id_miestnosti)
                    where miestnost.id_oddelenia in (select id_oddelenia from zamestnanci where cislo_zam =:id)
                    order by hospitalizacia.dat_do desc, hospitalizacia.dat_od desc
                   `,
      [id]
    );

    hospitalizacie.rows.forEach((element) => {
      element.type = "HOS";
    });

        return hospitalizacie.rows;
    } catch (err) {
      throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getHospitalizacieAdmin() {
    try {
        let conn = await database.getConnection();
        const hospitalizacie = await conn.execute(
            `select os_udaje.rod_cislo, meno, priezvisko, to_char(zdravotny_zaz.datum,'YYYY-MM-DD') || 'T' || to_char(hospitalizacia.dat_od, 'HH24:MI:SS') 
      as "start",id_zaznamu as "id_zaz", to_char(zdravotny_zaz.datum,'DD.MM.YYYY') || '-' || nvl(to_char(hospitalizacia.dat_do,'DD.MM.YYYY'),'Neukončená') datum
       from hospitalizacia
        join zdravotny_zaz using(id_zaznamu)
          join zdravotna_karta using(id_karty)
                 join pacient using(id_pacienta)
                  join os_udaje on(os_udaje.rod_cislo = pacient.rod_cislo) 
                  join lozko using(id_lozka)
                  join miestnost on (lozko.id_miestnost = miestnost.id_miestnosti)
                  join nemocnica on(miestnost.id_nemocnice = nemocnica.id_nemocnice)
                  join zamestnanci on(nemocnica.id_nemocnice = zamestnanci.id_nemocnice)
                    where zamestnanci.cislo_zam is not null
                    fetch first 20000 rows only`
        );

        hospitalizacie.rows.forEach((element) => {
            element.type = "HOS";
        });

        return hospitalizacie.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getLekarInfo(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select os_udaje.rod_cislo, meno, priezvisko,trunc(months_between(sysdate, to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) 
      || '.' || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek, to_char(to_date('19' || substr(os_udaje.rod_cislo, 0, 2) || '.' || mod(substr(os_udaje.rod_cislo, 3, 2),50) || '.' 
      || substr(os_udaje.rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia,
      PSC, mesto.nazov as nazov_obce from zamestnanci
                  join os_udaje on(os_udaje.rod_cislo = zamestnanci.rod_cislo) 
                  join mesto using(PSC) 
                    where zamestnanci.cislo_zam = :id`,
      [id]
    );

        return info.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getNemocnicaOddelenia(id) {
  try {
    let conn = await database.getConnection();
    console.log(id);
    const info = await conn.execute(
      `select oddelenie.id_oddelenia, oddelenie.typ_oddelenia as NAZOV from oddelenie 
      join nemocnica on(nemocnica.id_nemocnice = oddelenie.id_nemocnice)
      join zamestnanci on (nemocnica.id_nemocnice = zamestnanci.id_nemocnice)
      where zamestnanci.cislo_zam =:id`,
      [id]
    );

        return info.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
        console.log(err);
    }
}

async function getKonzilia(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT dovod, to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start"  from konzilium
            JOIN zam_konzilium using (id_konzilia)
            where cislo_zam =:id `,
      { id }
    );

    result.rows.forEach((element) => {
      element.type = "KONZ";
    });

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getOddeleniePrimara(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select o.id_oddelenia, o.typ_oddelenia as NAZOV from oddelenie o
      join zamestnanci z on (z.id_oddelenia = o.id_oddelenia)
      where cislo_zam =:id`,
      { id }
    );

    return info.rows[0];
  } catch (err) {
    console.log(err);
      throw new Error("Database error: " + err);
  }
}

async function getKolegovia(id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select meno || ' ' || priezvisko || ' - ' || typ_oddelenia as lekar , cislo_zam 
      from zamestnanci
      join os_udaje using(rod_cislo)
      join oddelenie o on(o.id_oddelenia = zamestnanci.id_oddelenia)
      where zamestnanci.id_nemocnice in (select id_nemocnice from zamestnanci where cislo_zam = :id) and cislo_zam <>:id`,
      [id, id]
    );

    return info.rows;
  } catch (err) {
    console.log(err);
      throw new Error("Database error: " + err);
  }
}

async function getZoznamVydanychReceptov(id, datum) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (datum.includes("&")) {
      dateSelection =
        " and to_char(datum_zapisu,'YYYY') = :rok and to_char(datum_zapisu,'MM') = :mesiac";
      args = {
        cislo_zam: id,
        rok: datum.split("&")[0],
        mesiac: Number(datum.split("&")[1]),
      };
    } else {
      dateSelection = " and to_char(datum_zapisu,'YYYY') = :rok";
      args = [id, datum];
    }
    const info = await conn.execute(
      `select datum_zapisu, nazov
      from recept
      join liek using(id_liek)
      where cislo_zam = :cislo_zam
     ${dateSelection}`,
      args
    );

    return info.rows;
  } catch (err) {
    console.log(err);
      throw new Error("Database error: " + err);
  }
}

async function getPacient(rod_cislo, id) {
  try {
    let conn = await database.getConnection();
    const info = await conn.execute(
      `select id_pacienta from pacient where rod_cislo =:rod_cislo
      AND id_nemocnice in (select id_nemocnice from zamestnanci where cislo_zam = :id)`,
      [rod_cislo.replace("$", "/"), id]
    );
    console.log(info);
    return info.rows[0];
  } catch (err) {
    console.log(err);
      throw new Error("Database error: " + err);
  }
}

module.exports = {
  getLekari,
  getPacienti,
  getPriemernyVek,
  getUdalosti,
  getOperacie,
  getVysetrenia,
  getHospitalizacie,
  getLekarInfo,
  getNemocnicaOddelenia,
  getZoznamLekarov,
  getOddeleniePrimara,
  getZoznamVydanychReceptov,
  getKolegovia,
  getOperacieAdmin,
  getHospitalizacieAdmin,
  getVysetreniaAdmin,
  getPacient,
};
