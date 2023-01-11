const database = require("../database/Database");

async function getLekari(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT meno, priezvisko, typ_oddelenia.nazov as oddelenie_nazov, nemocnica.nazov as nemocnica_nazov
          from lekar join zamestnanec using(id_zamestnanca) 
                    join os_udaje using(rod_cislo)
                    join oddelenie using(id_oddelenia)
                    join typ_oddelenia using(id_typu_oddelenia)
                    join nemocnica using(id_nemocnice)
              where id_nemocnice = get_id_nemocnice(:pid_lekara)
              and id_lekara <> :pid_lekara
              order by id_oddelenia`,
      { pid_lekara }
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
      `SELECT * FROM os_udaje join pacient using(rod_cislo) join lekar_pacient using(id_pacienta) where id_lekara = :pid_lekara`,
      { pid_lekara }
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
    operacie.forEach((element) => {
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

async function getOperacie(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const operacie = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(datum,'DD-MM-YYYY') datum 
          from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta) 
                        join operacia using(id_zaznamu)
                        join operacia_lekar using(id_operacie) where id_lekara = :pid_lekara`,
      { pid_lekara }
    );

    return operacie.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getVysetrenia(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const vysetrenia = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(datum,'DD-MM-YYYY') datum 
          from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta)
                        join lekar_pacient using(id_pacienta) where id_lekara = :pid_lekara`,
      { pid_lekara }
    );
    return vysetrenia.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getHospitalizacie(pid_lekara) {
  try {
    let conn = await database.getConnection();
    const hospitalizacie = await conn.execute(
      `select rod_cislo, meno, priezvisko, to_char(datum,'DD-MM-YYYY') dat_od, to_char(dat_do, 'DD-MM-YYYY') dat_do
          from os_udaje join pacient using(rod_cislo)
                        join zdravotny_zaznam using(id_pacienta) 
                        join hospitalizacia using(id_zaznamu) where id_lekara = :pid_lekara`,
      { pid_lekara }
    );
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
  getOperacie,
  getVysetrenia,
  getHospitalizacie,
};
