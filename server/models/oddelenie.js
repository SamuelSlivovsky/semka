const database = require("../database/Database");

async function getOddelenia() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM oddelenie`);

    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
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
     throw new Error('Database error: ' + err);
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
     throw new Error('Database error: ' + err);
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
     throw new Error('Database error: ' + err);
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
     throw new Error('Database error: ' + err);
  }
}

async function getPocetZamOddelenia(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_zamestnanca) as pocet_zamestnancov from oddelenie o 
        join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
        where z.id_oddelenia = :id_oddelenia
        and (to_char(dat_od, 'YYYY') <= :rok 
          or to_char(dat_do, 'YYYY') >= :rok
        )`,
      [id_oddelenia, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
  }
}

async function getPocetPacientovOddelenia(id_oddelenia) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(distinct lp.id_pacienta) as pocet_pacientov from oddelenie o 
          join zamestnanec z on (z.id_oddelenia = o.id_oddelenia)
          join lekar l on (l.id_zamestnanca = z.id_zamestnanca)
          join lekar_pacient lp on (lp.id_lekara = l.id_lekara)
          where z.id_oddelenia = :id_oddelenia`,
      [id_oddelenia]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
  }
}

async function getPocetOperaciiOddelenia(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_operacie) as poc_operacii from operacia o 
          join zdravotny_zaznam z on (z.id_zaznamu = o.id_zaznamu)
          join miestnost m on (m.id_miestnosti = o.id_miestnosti)
          where m.id_oddelenia = :id_oddelenia
          and to_char(z.datum,'YYYY') = :rok
              `,
      [id_oddelenia, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
  }
}

async function getPocetHospitalizaciiOddelenia(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_hospitalizacie) as poc_hospit from hospitalizacia h 
          join zdravotny_zaznam z on (z.id_zaznamu = h.id_zaznamu)
          join lozko l on (l.id_lozka = h.id_lozka)
          join miestnost m on (m.id_miestnosti = l.id_miestnosti)
          where m.id_oddelenia = :id_oddelenia
          and to_char(z.datum,'YYYY') = :rok
              `,
      [id_oddelenia, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
  }
}

async function getPocetVysetreniOddelenia(id_oddelenia, rok) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(id_vysetrenia) as poc_vys from vysetrenie v 
      join zdravotny_zaznam z on (z.id_zaznamu = v.id_zaznamu)
      join lekar l on (l.id_lekara = v.id_lekara)
      join zamestnanec zam on (zam.id_zamestnanca = l.id_zamestnanca)
      where zam.id_oddelenia = :id_oddelenia
      and to_char(z.datum,'YYYY') = :rok
              `,
      [id_oddelenia, rok]
    );
    console.log(result);
    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
  }
}

async function getKrvneSkupinyOddelenia(id_oddelenia) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select krvna_skupina, count(id_typu_krvnej_skupiny) as pocet from krvna_skupina join pacient using(id_typu_krvnej_skupiny)
                                                                                    join lekar_pacient using(id_pacienta)
                                                                                    join lekar using(id_lekara)
                                                                                    join zamestnanec using(id_zamestnanca)
                                                                                    where id_oddelenia = :id_oddelenia
                                                                                        group by krvna_skupina`,
      [id_oddelenia]
    );

    return result.rows;
  } catch (err) {
     throw new Error('Database error: ' + err);
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
     throw new Error('Database error: ' + err);
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
  getSumaVyplatRoka
};
