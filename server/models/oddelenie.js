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

async function getPocetPacientovOddelenia(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(distinct p.id_pacienta) as pocet_pacientov from oddelenie o 
          join zamestnanci z on (z.id_oddelenia = o.id_oddelenia)
          join nemocnica n on (n.id_nemocnice = o.id_nemocnice)
          join pacient p on (p.id_nemocnice = n.id_nemocnice)
          where o.id_oddelenia = (select id_oddelenia from zamestnanci where cislo_zam =:cislo_zam)`,
      [cislo_zam]
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
    const result = await conn.execute(
      `select count(id_operacie) as poc_operacii from operacia
          join zamestnanci using (cislo_zam)
          where id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
          and to_char(dat_operacie,'YYYY') = :rok
              `,
      [cislo_zam, rok]
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
      join oddelenie o on (o.id_oddelenia = l.id_oddelenia)
      join zamestnanci z on (z.id_oddelenia = o.id_oddelenia)
      where l.id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
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
    const result = await conn.execute(
      `select count(id_vysetrenia) as poc_vys from vysetrenie
      join zamestnanci using (cislo_zam)
      where id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
      and to_char(datum,'YYYY') = :rok
          `,
      [cislo_zam, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getKrvneSkupinyOddelenia(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select typ_krvi, count(typ_krvi) as pocet from zdravotna_karta
      join pacient using(id_pacienta)
      join nemocnica using(id_nemocnice)
      join zamestnanci using(id_nemocnice)
      where cislo_zam = :cislo_zam
      group by typ_krvi`,
      [cislo_zam]
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
};
