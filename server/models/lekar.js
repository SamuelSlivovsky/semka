const database = require('../database/Database');

async function getLekari() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM lekar`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getPacienti(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT * FROM os_udaje join pacient using(rod_cislo) join lekar_pacient using(id_pacienta) where id_lekara = :idaa_lekara`,
      { idaa_lekara: pid_lekara }
    );
    return result.rows;
  } catch (err) {
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
                from os_udaje join zamestnanec using(rod_cislo)
                join lekar using(id_zamestnanca)))) /
                (select count(distinct id_zamestnanca) from lekar) as priemerny_vek
             from dual`
    );
    return result.rows;
  } catch (err) {
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
      `select meno, priezvisko, to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", id_zaznamu as "id" from zdravotny_zaznam
                join operacia using(id_zaznamu)
                 join operacia_lekar using(id_operacie) 
                  join pacient using(id_pacienta)
                   join os_udaje using(rod_cislo) where id_lekara = :id`,
      [id]
    );

    operacie.rows.forEach((element) => {
      element.type = 'OPE';
    });

    return operacie.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getVysetrenia(id) {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select meno, priezvisko, to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", id_zaznamu as "id" from zdravotny_zaznam
                join vysetrenie using(id_zaznamu)
                 join pacient using(id_pacienta)
                  join os_udaje using(rod_cislo) 
                   where id_lekara = :id`,
      [id]
    );

    vysetrenia.rows.forEach((element) => {
      element.type = 'VYS';
    });

    return vysetrenia.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getHospitalizacie(id) {
  try {
    let conn = await database.getConnection();
    const hospitalizacie = await conn.execute(
      `select meno, priezvisko, to_char(datum,'YYYY-MM-DD') || 'T' || to_char(datum, 'HH24:MI:SS') as "start", id_zaznamu as "id" from zdravotny_zaznam
                join hospitalizacia using(id_zaznamu)
                 join pacient using(id_pacienta)
                  join os_udaje using(rod_cislo) 
                  where id_lekara = :id`,
      [id]
    );

    hospitalizacie.rows.forEach((element) => {
      element.type = 'HOS';
    });

    return hospitalizacie.rows;
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getLekari,
  getPacienti,
  getPriemernyVek,
  getUdalosti,
};
