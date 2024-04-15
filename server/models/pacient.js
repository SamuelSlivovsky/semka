const { element } = require("xml");
const database = require("../database/Database");

async function getPacienti() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM pacient`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getIdPacienta(rod_cislo) {
  rod_cislo = rod_cislo.replace("$", "/");
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT * FROM pacient where rod_cislo = :rod_cislo fetch first 1 rows only`,
      [rod_cislo]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getNajviacChoriPocet(pocet) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select poradie "Poradie", meno "Meno", priezvisko "Priezvisko", pocet_chorob "Počet chorôb" from 
                    (select meno, priezvisko, count(*) as pocet_chorob, rank() over(order by count(*) desc) as poradie
                        from os_udaje join pacient using(rod_cislo)
                                join zoznam_chorob zo using(id_pacienta)
                                    group by meno, priezvisko, rod_cislo) s_out
                                    where poradie <= :pocet`,
      [pocet]
    );
    console.log(result.rows);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNajviacOperovanyPercenta(percent) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select meno "Meno", priezvisko "Priezvisko", pocet_operacii "Počet operácií" from
                (select meno, priezvisko, count(*) as pocet_operacii, rank() over(order by count(*) desc) as poradie
                     from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join operacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join operacia using(id_zaznamu))`,
      [percent]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getNajviacHospitalizovaniPercenta(percent) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select meno "Meno", priezvisko "Priezvisko", pocet_hospitalizacii "Počet hospitalizácií" from
                (select meno, priezvisko, count(*) as pocet_hospitalizacii, rank() over(order by count(*) desc) as poradie
                    from os_udaje join pacient using(rod_cislo)
                                join zdravotny_zaznam using(id_pacienta)
                                 join hospitalizacia using(id_zaznamu)
                                  group by meno, priezvisko, rod_cislo)
                                   where poradie <= (:percent/100)*(select count(*) from os_udaje join pacient using(rod_cislo)
                                                                                         join zdravotny_zaznam using(id_pacienta)
                                                                                          join hospitalizacia using(id_zaznamu))`,
      [percent]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getTypyOckovaniaPacienti() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select  meno || ' ' || priezvisko as Meno,
                    sum(case when id_typu_ockovania=1 then 1 else 0 end) as "Záškrt",
                    sum(case when id_typu_ockovania=2 then 1 else 0 end) as "Tetanus",
                    sum(case when id_typu_ockovania=3 then 1 else 0 end) as "čierny kašeľ",
                    sum(case when id_typu_ockovania=4 then 1 else 0 end) as "Vírusový zápal pečene typu B (žltačka typu B)",
                    sum(case when id_typu_ockovania=5 then 1 else 0 end) as "Hemofilové invazívne nákazy",
                    sum(case when id_typu_ockovania=6 then 1 else 0 end) as "Detská obrna",
                    sum(case when id_typu_ockovania=7 then 1 else 0 end) as "Pneumokokové invazívne ochorenia",
                    sum(case when id_typu_ockovania=8 then 1 else 0 end) as "Osýpky",
                    sum(case when id_typu_ockovania=9 then 1 else 0 end) as "Ružienka",
                    sum(case when id_typu_ockovania=10 then 1 else 0 end) as "Mumps"
            from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                        left join ockovanie using(id_zaznamu)
            group by meno, priezvisko, rod_cislo`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPacientiChorobaP13() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select meno "Meno", priezvisko "Priezvisko", nazov "Názov choroby"
                from os_udaje join pacient using(rod_cislo)
                join zoznam_chorob using(id_pacienta)
                join choroba using(id_choroby)
                where to_char(datum_od, 'D') = '5' and to_char(datum_od, 'DD') = '13'
                order by meno, priezvisko`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPocetPacientiPodlaVeku(cislo_zam, rok) {
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
      `SELECT count(distinct p.id_pacienta) as pocet,
      CASE
            WHEN substr(p.rod_cislo,3,1) = 2 OR substr(p.rod_cislo,3,1) = 3 THEN
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),20) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
            WHEN substr(p.rod_cislo,3,1) = 7 OR substr(p.rod_cislo,3,1) = 8 THEN
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),70) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
            ELSE
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),50) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
        END AS vek
                  
      FROM zdravotna_karta k
      JOIN zdravotny_zaz zaz USING(id_karty)
      LEFT JOIN operacia o ON zaz.id_zaznamu = o.id_zaznamu
      LEFT JOIN vysetrenie v ON zaz.id_zaznamu = v.id_zaznamu
      LEFT JOIN hospitalizacia h ON zaz.id_zaznamu = h.id_zaznamu
      LEFT JOIN zamestnanci zam ON zam.cislo_zam = v.cislo_zam OR zam.cislo_zam = o.cislo_zam
      LEFT JOIN lozko l ON h.id_lozka = l.id_lozka
      LEFT JOIN miestnost m ON l.id_miestnost = m.id_miestnosti
      LEFT JOIN oddelenie od ON m.id_oddelenia = od.id_oddelenia OR zam.id_oddelenia = od.id_oddelenia
      left join pacient p on (k.id_pacienta = p.id_pacienta)
      WHERE od.id_oddelenia = (SELECT id_oddelenia FROM zamestnanci WHERE cislo_zam = :cislo_zam)
      ${dateSelection}
       group by  CASE
            WHEN substr(p.rod_cislo,3,1) = 2 OR substr(p.rod_cislo,3,1) = 3 THEN
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),20) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
            WHEN substr(p.rod_cislo,3,1) = 7 OR substr(p.rod_cislo,3,1) = 8 THEN
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),70) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
            ELSE
                trunc(months_between(sysdate, to_date('19' || substr(p.rod_cislo, 0, 2) || '.' || mod(substr(p.rod_cislo, 3, 2),50) || '.' || substr(p.rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
        END 
        order by 2`,
      args
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getInfo(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT DISTINCT
    id_pacienta,
    meno,
    priezvisko,
    rod_cislo,
    case WHEN substr(rod_cislo,3,1) = 2 OR substr(rod_cislo,3,1) = 3 OR substr(rod_cislo,3,1) = 7 OR substr(rod_cislo,3,1) = 8
    then 1
    else 0
    end as cudzinec,
    telefon,
    email,
    CASE
        WHEN substr(rod_cislo,3,1) = 2 OR substr(rod_cislo,3,1) = 3 THEN
            trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),20) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
        WHEN substr(rod_cislo,3,1) = 7 OR substr(rod_cislo,3,1) = 8 THEN
            trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),70) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
        ELSE
            trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
    END AS vek,
    CASE
        WHEN substr(rod_cislo,3,1) = 2 OR substr(rod_cislo,3,1) = 3 THEN
            to_char(to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),20) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY')
        WHEN substr(rod_cislo,3,1) = 7 OR substr(rod_cislo,3,1) = 8 THEN
            to_char(to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),70) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY')
        ELSE
            to_char(to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY')
    END AS datum_narodenia,
    datum_umrtia,
    typ_krvi,
    PSC,
    ulica,
    id_poistenca,
    mesto.nazov AS nazov_obce,
    poistovna.nazov AS nazov_poistovne,
    pacient.dat_od as datum_zapisu
FROM
    os_udaje
JOIN
    pacient USING(rod_cislo)
LEFT JOIN
    zdravotna_karta USING(id_pacienta)
LEFT JOIN
    mesto USING(PSC)
LEFT JOIN
    poistenie USING(id_pacienta)
LEFT JOIN
    poistovna USING(ICO)
WHERE
    id_pacienta = :id
`,
      [id]
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDoctorsOfPatient(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select meno, priezvisko, mail, t.nazov, n.nazov from os_udaje ou
      join zamestnanec z on(ou.rod_cislo=z.rod_cislo)
      join lekar l on(z.id_zamestnanca=l.id_zamestnanca)
      join lekar_pacient lp on(lp.id_lekara = l.id_lekara and lp.id_pacienta = :id)
      join oddelenie o on (o.id_oddelenia = z.id_oddelenia)
      join nemocnica n on(n.id_nemocnice = o.id_nemocnice)
      join typ_oddelenia t on(t.id_typu_oddelenia = o.id_typu_oddelenia);`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getUdalosti(rod_cislo) {
  rod_cislo = rod_cislo.replace("$", "/");
  try {
    let udalosti = [];

    let operacie = await getOperacie(rod_cislo);
    operacie.forEach((element) => {
      udalosti.push(element);
    });

    let vysetrenia = await getVysetrenia(rod_cislo);
    vysetrenia.forEach((element) => {
      udalosti.push(element);
    });

    let hospitalizacie = await getHospitalizacie(rod_cislo);
    hospitalizacie.forEach((element) => {
      udalosti.push(element);
    });

    console.log(udalosti);
    return udalosti;
  } catch (err) {
    console.log(err);
  }
}

async function getOperacie(rod_cislo) {
  try {
    let conn = await database.getConnection();
    const operacie = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(dat_operacie,'YYYY-MM-DD') || 'T' || to_char(dat_operacie, 'HH24:MI:SS') as 
      "start",id_operacie as "id" ,id_zaznamu as "id_zaz", to_char(dat_operacie,'DD.MM.YYYY') datum from zdravotny_zaz
        join operacia using(id_zaznamu) 
        join zdravotna_karta using(id_karty)
        join pacient using(id_pacienta)
        join os_udaje using(rod_cislo)
        where rod_cislo = :rod_cislo`,
      [rod_cislo]
    );

    operacie.rows.forEach((element) => {
      element.type = "OPE";
    });

    return operacie.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getOckovania(id) {
  try {
    let conn = await database.getConnection();
    const ockovania = await conn.execute(
      `select nazov, typ, to_char(dat_ockovania,'DD.MM.YYYY') as "DATUM" from zdravotna_karta
        join zoznam_vakcin using(id_karty)
        join vakcina using(id_vakciny)

         where id_pacienta = :id`,
      [id]
    );

    ockovania.rows.forEach((element) => {
      element.type = "OCK";
    });

    return ockovania.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getOckovaniaAdmin() {
  try {
    let conn = await database.getConnection();
    const ockovania = await conn.execute(
      `select nazov, typ, to_char(dat_ockovania,'DD.MM.YYYY') as "DATUM" from zdravotna_karta
        join zoznam_vakcin using(id_karty)
        join vakcina using(id_vakciny)`
    );

    ockovania.rows.forEach((element) => {
      element.type = "OCK";
    });
    return ockovania.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getVysetrenia(rod_cislo) {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select to_char(vysetrenie.datum,'YYYY-MM-DD') || 'T' || to_char(vysetrenie.datum, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id_zaz" from zdravotny_zaz
      join vysetrenie using(id_zaznamu)
        join zdravotna_karta using (id_karty)
        join pacient using(id_pacienta) where rod_cislo = :rod_cislo`,
      [rod_cislo]
    );

    vysetrenia.rows.forEach((element) => {
      element.type = "VYS";
    });

    return vysetrenia.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getHospitalizacie(rod_cislo) {
  try {
    let conn = await database.getConnection();
    const hospitalizacia = await conn.execute(
      `select to_char(hospitalizacia.dat_od,'YYYY-MM-DD') || 'T' || to_char(hospitalizacia.dat_od, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id_zaz" from zdravotny_zaz
      join hospitalizacia using(id_zaznamu) 
      join zdravotna_karta using (id_karty)
      join pacient using(id_pacienta) where rod_cislo = :rod_cislo`,
      [rod_cislo]
    );

    hospitalizacia.rows.forEach((element) => {
      element.type = "HOS";
    });

    return hospitalizacia.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getRecepty(pid_pacienta) {
  try {
    let conn = await database.getConnection();
    const recepty = await conn.execute(
      `select nazov, to_char(datum_zapisu, 'DD.MM.YYYY ') as datum_zapisu, to_char(datum_prevzatia, 'DD.MM.YYYY ') as datum_prevzatia,meno || ' ' || priezvisko as lekar
            from recept join liek using(id_liek)
                        join zamestnanci zc using(cislo_zam)
                        join os_udaje ou on(ou.rod_cislo = zc.rod_cislo) 
                  where id_pacienta = :pid_pacienta
                  order by recept.datum_zapisu`,
      { pid_pacienta }
    );
    console.log(recepty.rows);
    return recepty.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getReceptyAdmin() {
  try {
    let conn = await database.getConnection();
    const recepty = await conn.execute(
      `select nazov, to_char(datum_zapisu, 'DD.MM.YYYY') as datum_zapisu, meno || ' ' || priezvisko as lekar
            from recept join liek using(id_liek)
                        join zamestnanci zc using(cislo_zam)
                        join os_udaje ou on(ou.rod_cislo = zc.rod_cislo) 
                  order by recept.datum_zapisu`
    );
    console.log(recepty.rows);
    return recepty.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZdravZaznamy(pid_pacienta) {
  try {
    let conn = await database.getConnection();
    const zdravZaznamy = await conn.execute(
      `select id_zaznamu as "id_zaz", to_char(datum, 'DD.MM.YYYY') DATUM,prepustacia_sprava, 
       case when id_hosp is not null then 
       nvl(to_char(hospitalizacia.dat_do,'DD.MM.YYYY HH24:MI:SS'),'Neukončená') 
       else null end
       as dat_do,
       hospitalizacia.dat_do as unformated_dat_do , get_typ_zdrav_zaznamu(id_zaznamu) as typ,
       id_hosp
          from zdravotny_zaz 
          left join hospitalizacia using (id_zaznamu)   
          join zdravotna_karta using(id_karty)
            where id_pacienta = :pid_pacienta
                  order by zdravotny_zaz.datum desc`,
      { pid_pacienta }
    );
    console.log(zdravZaznamy.rows);
    return zdravZaznamy.rows;
  } catch (err) {
    console.log(err);
  }
}

//TODO Spomenut v diplomovej praci obmedzenie na 1000 zaznamov z dovodu optimalizacie rychlosti.
async function getZdravZaznamyAdmin() {
  try {
    let conn = await database.getConnection();
    const zdravZaznamy = await conn.execute(
      `select id_zaznamu as "id_zaz", to_char(datum, 'DD.MM.YYYY') datum, get_typ_zdrav_zaznamu(id_zaznamu) as typ
            from zdravotny_zaz
                    join zdravotna_karta using (id_karty)
                    order by zdravotny_zaz.datum desc
                    fetch first 1000 rows only`
    );
    return zdravZaznamy.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getChoroby(pid_pacienta) {
  try {
    let conn = await database.getConnection();
    const choroby = await conn.execute(
      `select nazov, typ, to_char(zo.dat_od,'DD.MM.YYYY') dat_od, nvl(to_char(zo.dat_do,'DD.MM.YYYY'), 'Súčasnosť') dat_do
            from zoznam_ochoreni zo join choroba on(zo.id_choroby = choroba.id_choroby)
                          join zdravotna_karta zk on(zo.id_karty = zk.id_karty)
                          where id_pacienta = :pid_pacienta
                          order by dat_od, dat_do`,
      { pid_pacienta }
    );
    console.log(choroby);
    return choroby.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getChorobyAdmin() {
  try {
    let conn = await database.getConnection();
    const choroby = await conn.execute(
      `select nazov, typ, to_char(zo.dat_od,'DD.MM.YYYY') dat_od, nvl(to_char(zo.dat_do,'DD.MM.YYYY'), 'Súčasnosť') dat_do
            from zoznam_ochoreni zo join choroba on(zo.id_choroby = choroba.id_choroby)
                          join zdravotna_karta zk on(zo.id_karty = zk.id_karty)
                          order by dat_od, dat_do`
    );
    return choroby.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getTypyZTP(pid_pacienta) {
  try {
    let conn = await database.getConnection();
    const typyZTP = await conn.execute(
      `select id_postihnutia, nazov, to_char(datum_od,'DD.MM.YYYY') dat_od, nvl(to_char(datum_do,'DD.MM.YYYY'), 'Súčasnosť') dat_do
          from zoznam_postihnuti join postihnutie using (id_postihnutia)
                              join zdravotna_karta using (id_karty)
                              where id_pacienta = :pid_pacienta`,
      { pid_pacienta }
    );
    console.log(typyZTP.rows);
    return typyZTP.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getTypyZTPAdmin() {
  try {
    let conn = await database.getConnection();
    const typyZTP = await conn.execute(
      `select id_postihnutia, nazov, to_char(datum_od,'DD.MM.YYYY') dat_od, nvl(to_char(datum_do,'DD.MM.YYYY'), 'Súčasnosť') dat_do
          from zoznam_postihnuti join postihnutie using (id_postihnutia)
                              join zdravotna_karta using (id_karty)`
    );
    return typyZTP.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertPacient(body) {
  try {
    let conn = await database.getConnection();
    let sqlStatement;
    let result;
    if (!body.cudzinec) {
      sqlStatement = `BEGIN
    pacient_insert(:meno, :priezvisko, :psc, :rod_cislo, :id_lekara, :ulica, :dat_od, :dat_do, :typ_krvi, :poistenec ,:poistovna,:tel,:mail);
    END;`;
      result = await conn.execute(sqlStatement, {
        rod_cislo: body.rod_cislo,
        meno: body.meno,
        priezvisko: body.priezvisko,
        psc: body.psc,
        id_lekara: body.id_lekara,
        ulica: body.ulica,
        dat_od: body.dat_od,
        dat_do: body.dat_do,
        typ_krvi: body.typ_krvi,
        poistenec: body.poistenec,
        poistovna: body.poistovna,
        tel: body.tel,
        mail: body.mail,
      });
    } else {
      sqlStatement = `BEGIN
    cudzinec_insert(:meno, :priezvisko, :psc, :dat_narodenia,:pohlavie, :id_lekara, :ulica, :dat_od, :dat_do, :typ_krvi,:tel,:mail);
    END;`;
      result = await conn.execute(sqlStatement, {
        meno: body.meno,
        priezvisko: body.priezvisko,
        psc: body.psc,
        dat_narodenia: body.dat_narodenia,
        pohlavie: body.pohlavie,
        id_lekara: body.id_lekara,
        ulica: body.ulica,
        dat_od: body.dat_od,
        dat_do: body.dat_do,
        typ_krvi: body.typ_krvi,
        tel: body.tel,
        mail: body.mail,
      });
    }
    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateTimeOfDeath(body) {
  try {
    let conn = await database.getConnection();
    await conn.execute(
      `update pacient set datum_umrtia = to_date(to_char(to_timestamp(:datum_umrtia,'DD/MM/YYYY HH24:MI:SS'),
      'DD/MM/YYYY HH24:MI:SS')) where id_pacienta = :id_pacienta`,
      { datum_umrtia: body.datum_umrtia, id_pacienta: body.id_pacienta },
      { autoCommit: true }
    );
  } catch (err) {
    console.log(err);
  }
}

async function updatePacient(body) {
  try {
    let conn = await database.getConnection();
    await conn.execute(
      `UPDATE os_udaje SET 
      rod_cislo = :rod_cislo,
      meno = :meno,
      priezvisko = :priezvisko,
      PSC = :psc,
      ulica = :ulica,
      telefon = :telefon,
      email = :email
      WHERE rod_cislo = :rod_cislo`,
      {
        rod_cislo: body.rod_cislo,
        meno: body.meno,
        priezvisko: body.priezvisko,
        PSC: body.psc,
        ulica: body.ulica,
        telefon: body.tel,
        email: body.mail,
      },
      { autoCommit: true }
    );
    await conn.execute(
      `UPDATE pacient SET 
      rod_cislo = :rod_cislo,
      dat_od = :dat_od
      WHERE id_pacienta = :id_pacienta`,
      {
        rod_cislo: body.rod_cislo,
        dat_od: body.dat_od,
        id_pacienta: body.id_pacienta,
      },
      { autoCommit: true }
    );
    await conn.execute(
      `UPDATE zdravotna_karta SET 
      typ_krvi = :typ_krvi
      WHERE id_pacienta = :id_pacienta`,
      {
        typ_krvi: body.typ_krvi,
        id_pacienta: body.id_pacienta,
      },
      { autoCommit: true }
    );
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getPacienti,
  getNajviacChoriPocet,
  getNajviacOperovanyPercenta,
  getNajviacHospitalizovaniPercenta,
  getTypyOckovaniaPacienti,
  getPacientiChorobaP13,
  getPocetPacientiPodlaVeku,
  getInfo,
  getUdalosti,
  getRecepty,
  getZdravZaznamy,
  getChoroby,
  getTypyZTP,
  getDoctorsOfPatient,
  getIdPacienta,
  getOckovania,
  updateTimeOfDeath,
  getChorobyAdmin,
  getOckovaniaAdmin,
  getZdravZaznamyAdmin,
  getTypyZTPAdmin,
  getReceptyAdmin,
  getDoctorsOfPatient,
  insertPacient,
  updatePacient,
};
