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

async function getPocetPacientiPodlaVeku() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select count(*) as pocet, trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek
            from pacient join os_udaje using(rod_cislo)
             group by trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12)
              order by 2`
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
      `select meno, priezvisko, rod_cislo,
        trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek,
        to_char(to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia, tel, mail,
        krvna_skupina, PSC, obec.nazov as nazov_obce, poistovna.nazov as nazov_poistovne 
         from os_udaje join pacient using(rod_cislo)
          join krvna_skupina using(id_typu_krvnej_skupiny)
          join obec using(PSC) 
          join poistenec using(id_poistenca)
          join poistovna using(id_poistovne)
            where id_pacienta = :id`,
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

async function getUdalosti(id) {
  try {
    let udalosti = [];

    let operacie = await getOperacie(id);
    operacie.forEach((element) => {
      udalosti.push(element);
    });

    let ockovania = await getOckovania(id);
    ockovania.forEach((element) => {
      udalosti.push(element);
    });

    let vysetrenia = await getVysetrenia(id);
    vysetrenia.forEach((element) => {
      udalosti.push(element);
    });

    let hospitalizacie = await getHospitalizacie(id);
    hospitalizacie.forEach((element) => {
      udalosti.push(element);
    });

    console.log(udalosti);
    return udalosti;
  } catch (err) {
    console.log(err);
  }
}

async function getOperacie(id) {
  try {
    let conn = await database.getConnection();
    const operacie = await conn.execute(
      `select to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id" from zdravotny_zaznam
        join operacia using(id_zaznamu) where id_pacienta = :id`,
      [id]
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
      `select to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id" from zdravotny_zaznam
        join ockovanie using(id_zaznamu) where id_pacienta = :id`,
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

async function getVysetrenia(id) {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id" from zdravotny_zaznam
        join vysetrenie using(id_zaznamu) where id_pacienta = :id`,
      [id]
    );

    vysetrenia.rows.forEach((element) => {
      element.type = "VYS";
    });

    return vysetrenia.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getHospitalizacie(id) {
  try {
    let conn = await database.getConnection();
    const hospitalizacia = await conn.execute(
      `select to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", to_char(id_zaznamu) as "id" from zdravotny_zaznam
        join hospitalizacia using(id_zaznamu) where id_pacienta = :id`,
      [id]
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
      `select nazov, to_char(datum, 'DD.MM.YYYY') as datum, meno || ' ' || priezvisko as lekar
            from recept join liek using(id_lieku)
                        join lekar using(id_lekara)
                        join zamestnanec zc using(id_zamestnanca)
                        join os_udaje ou on(ou.rod_cislo = zc.rod_cislo) 
                  where id_pacienta = :pid_pacienta
                  and datum_vyzdvihnutia is null
                  order by recept.datum`,
      { pid_pacienta }
    );

    return recepty.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getZdravZaznamy(pid_pacienta) {
  try {
    let conn = await database.getConnection();
    const zdravZaznamy = await conn.execute(
      `select id_zaznamu as "id", to_char(datum, 'DD.MM.YYYY') DATUM, get_typ_zdrav_zaznamu(id_zaznamu) as typ, 
                                                     get_nazov_oddelenia(id_zaznamu) as oddelenie, 
                                                     get_nazov_lekara(id_zaznamu) as lekar  
          from zdravotny_zaznam  
            where id_pacienta = :pid_pacienta
                  order by zdravotny_zaznam.datum`,
      { pid_pacienta }
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
      `select nazov, typ, to_char(datum_od,'MM.DD.YYYY') dat_od, nvl(to_char(datum_do,'MM.DD.YYYY'), 'Súčasnosť') dat_do
            from zoznam_chorob join choroba using(id_choroby)
                               join typ_choroby using(id_typu_choroby)
                          where id_pacienta = :pid_pacienta
                          order by datum_od, datum_do`,
      { pid_pacienta }
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
      `select nazov, to_char(dat_od,'MM.DD.YYYY') dat_od, nvl(to_char(dat_do,'MM.DD.YYYY'), 'Súčasnosť') dat_do
          from pacient_ZTP join typ_ZTP using (id_typu_ztp)
                              where id_pacienta = :pid_pacienta`,
      { pid_pacienta }
    );

    return typyZTP.rows;
  } catch (err) {
    console.log(err);
  }
}

async function insertPacient(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    pacient_insert(:meno, :priezvisko, :psc, :telefon, :email, :rod_cislo, :id_poistenca, :id_typu_krvnej_skupiny, :id_lekara);
    END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      id_poistenca: body.id_poistenca,
      id_typu_krvnej_skupiny: body.id_typu_krvnej_skupiny,
      meno: body.meno,
      priezvisko: body.priezvisko,
      rod_cislo: body.rod_cislo,
      email: body.email,
      telefon: body.telefon,
      psc: body.psc,
      id_lekara: body.id_lekara,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
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
  insertPacient,
  getDoctorsOfPatient,
  insertPacient,
};
