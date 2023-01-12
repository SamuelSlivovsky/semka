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
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
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
    throw new Error('Database error: ' + err);
  }
}

async function getInfo(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select meno, priezvisko, rod_cislo,
        trunc(months_between(sysdate, to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'))/12) as Vek,
        to_char(to_date('19' || substr(rod_cislo, 0, 2) || '.' || mod(substr(rod_cislo, 3, 2),50) || '.' || substr(rod_cislo, 5, 2), 'YYYY.MM.DD'),'DD.MM.YYYY') as datum_narodenia, tel, mail,
        krvna_skupina, PSC, nazov 
         from os_udaje join pacient using(rod_cislo)
          join krvna_skupina using(id_typu_krvnej_skupiny)
           join obec using(PSC) where id_pacienta = :id`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
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
      element.type = 'OPE';
    });

    return operacie.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
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
      element.type = 'OCK';
    });

    return ockovania.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
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
      element.type = 'VYS';
    });

    return vysetrenia.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
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
      element.type = 'HOS';
    });

    return hospitalizacia.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertPacient(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
    pacient_insert(:meno, :priezvisko, :psc, :telefon, :email, :rod_cislo, :id_poistenca, :id_typu_krvnej_skupiny, :id_lekara);
    END;`;

    console.log(body);
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

    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
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
  insertPacient,
};
