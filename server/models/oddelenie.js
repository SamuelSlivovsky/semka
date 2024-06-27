const database = require("../database/Database");

async function getOddelenia() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM oddelenie`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getTopZamestnanciVyplatyPocet(pocet) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select nazov_nemocnice "Nemocnica", nazov_oddelenia "Oddelenie", listagg(mpz, ', ')
            within group(order by zarobok desc) as "Najlepšie zarábajúci"
                from (select nazov_nemocnice, nazov_oddelenia, mpz, zarobok 
                    from (select nem.nazov as nazov_nemocnice,
                             tod.nazov as nazov_oddelenia, meno || ' ' || priezvisko || ' - ' || sum(suma) || ' eur' as mpz, sum(suma) as zarobok,
                                dense_rank() over(partition by od.id_oddelenia order by sum(suma) desc) as poradie
                                    from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                                   join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                                    join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                                     join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                                      join vyplaty_mw vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                                        group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                                  where poradie <= :pocet)                               
                 group by nazov_nemocnice, nazov_oddelenia`,
      [pocet]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getTopZamestnanciVyplatyOddelenie(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select  poradie, Zamestnanec, zarobok "Zárobok"
        from (select meno || ' ' || priezvisko as Zamestnanec ,nazov_nemocnice, nazov_oddelenia, zarobok, poradie 
          from (select meno, priezvisko, nem.nazov as nazov_nemocnice,
                   tod.nazov as nazov_oddelenia, sum(suma) as zarobok,
                      rank() over(order by sum(suma) desc) as poradie
                          from os_udaje osu join zamestnanec zam on(osu.rod_cislo = zam.rod_cislo)
                                         join oddelenie od on(od.id_oddelenia = zam.id_oddelenia)
                                          join typ_oddelenia tod on(od.id_typu_oddelenia = tod.id_typu_oddelenia)
                                           join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                            join vyplaty_mw vyp on(vyp.id_zamestnanca = zam.id_zamestnanca)
                                             where od.id_oddelenia = :id_oddelenia and to_char(datum, 'YYYY') = :rok
                                              group by nem.id_nemocnice, nem.nazov, tod.nazov, meno, priezvisko, osu.rod_cislo, od.id_oddelenia)
                        where poradie <= 5)`,
      [id_oddelenia, rok]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getZamestnanciOddeleni() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select n.nazov  "Nemocnica", typ.nazov as "Oddelenie",
                    listagg(ou.meno || ' ' || ou.priezvisko, ', ') within group (order by ou.priezvisko) as "Zamestnanci"
            from oddelenie o join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                            join nemocnica n on (n.id_nemocnice = o.id_nemocnice)
                            join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
                            join os_udaje ou on (z.rod_cislo = ou.rod_cislo)
            group by n.nazov, n.id_nemocnice, typ.nazov, o.id_oddelenia`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getZamestnanciOddelenia(id_oddelenia) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select ou.meno || ' ' || ou.priezvisko "Zamestnanec", z.id_zamestnanca "Id"
            from oddelenie o 
                            join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
                            join os_udaje ou on (z.rod_cislo = ou.rod_cislo)
                            where z.id_oddelenia = :id_oddelenia
          `,
      [id_oddelenia]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetZamOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(cislo_zam) as pocet_zamestnancov from oddelenie o 
        join zamestnanci z on (z.id_oddelenia = o.id_oddelenia)
        where z.id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
        and (to_char(dat_od, 'YYYY') <= :rok 
          or to_char(dat_do, 'YYYY') >= :rok
        )`,
      [cislo_zam, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetPacientovOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        " and EXTRACT(YEAR FROM zaz.datum) = :rok and EXTRACT(MONTH FROM zaz.datum) = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = " and EXTRACT(YEAR FROM zaz.datum) = :rok";
      args = [cislo_zam, rok];
    }
    const result = await conn.execute(
      `SELECT COUNT(DISTINCT id_karty) as POCET_PACIENTOV
      FROM zdravotna_karta k
      JOIN zdravotny_zaz zaz USING(id_karty)
      LEFT JOIN operacia o ON zaz.id_zaznamu = o.id_zaznamu
      LEFT JOIN vysetrenie v ON zaz.id_zaznamu = v.id_zaznamu
      LEFT JOIN hospitalizacia h ON zaz.id_zaznamu = h.id_zaznamu
      LEFT JOIN zamestnanci zam ON zam.cislo_zam = v.cislo_zam OR zam.cislo_zam = o.cislo_zam
      LEFT JOIN lozko l ON h.id_lozka = l.id_lozka
      LEFT JOIN miestnost m ON l.id_miestnost = m.id_miestnosti
      LEFT JOIN oddelenie od ON m.id_oddelenia = od.id_oddelenia OR zam.id_oddelenia = od.id_oddelenia
      WHERE od.id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
      ${dateSelection}`,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetOperaciiOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        "and to_char(dat_operacie,'YYYY') = :rok and to_char(dat_operacie,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = "and to_char(dat_operacie,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    console.log(args);
    const result = await conn.execute(
      `select count(id_operacie) as poc_operacii from operacia
          join zamestnanci using (cislo_zam)
          where id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
          ${dateSelection}
              `,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetOperaciiZamestnanca(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        "and to_char(dat_operacie,'YYYY') = :rok and to_char(dat_operacie,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = "and to_char(dat_operacie,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    console.log(args);
    const result = await conn.execute(
      `select count(id_operacie) as poc_operacii from operacia
          WHERE cislo_zam = :cislo_zam
          ${dateSelection}
              `,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetHospitalizaciiOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_hosp) as poc_hospitalizacii from hospitalizacia h
      join lozko l on (l.id_lozka = h.id_lozka)
      join miestnost m on (m.id_miestnosti = l.id_miestnost)
      join oddelenie o on (o.id_oddelenia = m.id_oddelenia)
      join zamestnanci z on (z.id_oddelenia = o.id_oddelenia)
      where m.id_oddelenia = z.id_oddelenia AND z.cislo_zam = :cislo_zam
      and to_char(h.dat_od,'YYYY') = :rok`,
      [cislo_zam, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetVysetreniOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        "and to_char(datum,'YYYY') = :rok and to_char(datum,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = "and to_char(datum,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    const result = await conn.execute(
      `select count(id_vysetrenia) as poc_vys from vysetrenie
      join zamestnanci using (cislo_zam)
      where id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
      ${dateSelection}
          `,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetVysetreniZamestnanca(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        " and to_char(datum,'YYYY') = :rok and to_char(datum,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = " and to_char(datum,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    const result = await conn.execute(
      `select count(id_vysetrenia) as poc_vys from vysetrenie
      where cislo_zam = :cislo_zam
      ${dateSelection}
          `,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getKrvneSkupinyOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        " and to_char(zaz.datum,'YYYY') = :rok and to_char(zaz.datum,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = " and to_char(zaz.datum,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    const result = await conn.execute(
      `SELECT  typ_krvi, COUNT(distinct id_karty) AS pocet
      FROM zdravotna_karta k
      JOIN zdravotny_zaz zaz USING(id_karty)
      LEFT JOIN operacia o ON zaz.id_zaznamu = o.id_zaznamu
      LEFT JOIN vysetrenie v ON zaz.id_zaznamu = v.id_zaznamu
      LEFT JOIN hospitalizacia h ON zaz.id_zaznamu = h.id_zaznamu
      LEFT JOIN zamestnanci zam ON zam.cislo_zam = v.cislo_zam OR zam.cislo_zam = o.cislo_zam
      LEFT JOIN lozko l ON h.id_lozka = l.id_lozka
      LEFT JOIN miestnost m ON l.id_miestnost = m.id_miestnosti
      LEFT JOIN oddelenie od ON m.id_oddelenia = od.id_oddelenia OR zam.id_oddelenia = od.id_oddelenia
      LEFT JOIN pacient p ON k.id_pacienta = p.id_pacienta
      WHERE od.id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
      ${dateSelection}
      GROUP BY  typ_krvi`,
      args
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getSumaVyplatRoka(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select sum(case when to_char(datum, 'MM') = '01' then suma else 0 end) as Januar,
                sum(case when to_char(datum, 'MM') = '02' then suma else 0 end) as Februar,
                sum(case when to_char(datum, 'MM') = '03' then suma else 0 end) as Marec,
                sum(case when to_char(datum, 'MM') = '04' then suma else 0 end) as April,
                sum(case when to_char(datum, 'MM') = '05' then suma else 0 end) as Maj,
                sum(case when to_char(datum, 'MM') = '06' then suma else 0 end) as Jun,
                sum(case when to_char(datum, 'MM') = '07' then suma else 0 end) as Jul,
                sum(case when to_char(datum, 'MM') = '08' then suma else 0 end) as August,
                sum(case when to_char(datum, 'MM') = '09' then suma else 0 end) as September,
                sum(case when to_char(datum, 'MM') = '10' then suma else 0 end) as Oktober,
                sum(case when to_char(datum, 'MM') = '11' then suma else 0 end) as November,
                sum(case when to_char(datum, 'MM') = '12' then suma else 0 end) as December
                from nemocnica join oddelenie using(id_nemocnice)
                             join zamestnanec using(id_oddelenia)
                              join vyplaty_mw using(id_zamestnanca)
                                 where id_oddelenia = :id_oddelenia and to_char(datum, 'YYYY') = :rok`,
      [id_oddelenia, rok]
    );
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getUdalostiOddelenia(cislo_zam, rok) {
  try {
    let conn = await database.getConnection();
    let dateSelection;
    let args;
    if (rok.includes("&")) {
      dateSelection =
        " and to_char(zaz.datum,'YYYY') = :rok and to_char(zaz.datum,'MM') = :mesiac";
      args = {
        cislo_zam: cislo_zam,
        rok: rok.split("&")[0],
        mesiac: Number(rok.split("&")[1]),
      };
    } else {
      dateSelection = " and to_char(zaz.datum,'YYYY') = :rok";
      args = [cislo_zam, rok];
    }
    const result = await conn.execute(
      `select meno || ', ' || priezvisko as meno ,count(id_vysetrenia) as pocetVys, count(id_operacie) as pocetOpe
      from zdravotny_zaz zaz
      left join vysetrenie v using(id_zaznamu)
      left join operacia o using(id_zaznamu)
      join zamestnanci z on (v.cislo_zam = z.cislo_zam OR o.cislo_zam = z.cislo_zam)
      join os_udaje using (rod_cislo)
      where id_oddelenia in (select id_oddelenia from zamestnanci where cislo_zam = :cislo_zam)
      ${dateSelection}
      group by z.cislo_zam, meno, priezvisko
      `,
      args
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getOddelenia,
  getTopZamestnanciVyplatyPocet,
  getZamestnanciOddeleni,
  getZamestnanciOddelenia,
  getPocetZamOddelenia,
  getPocetHospitalizaciiOddelenia,
  getPocetOperaciiOddelenia,
  getPocetVysetreniOddelenia,
  getPocetPacientovOddelenia,
  getKrvneSkupinyOddelenia,
  getTopZamestnanciVyplatyOddelenie,
  getSumaVyplatRoka,
  getPocetOperaciiZamestnanca,
  getPocetVysetreniZamestnanca,
  getUdalostiOddelenia,
};
