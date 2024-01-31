const database = require("../database/Database");

async function getOsobneUdaje() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM os_udaje`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getMenovciPacientLekar() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select p.meno "Meno", p.priezvisko as "Pacientovo priezvisko", l.priezvisko as "Lekárovo priezvisko" 
                    from lekar_pacient join pacient using(id_pacienta)
                    join os_udaje p on(p.rod_cislo = pacient.rod_cislo)
                    join lekar using(id_lekara)
                    join zamestnanec using(id_zamestnanca)
                    join os_udaje l on(l.rod_cislo = zamestnanec.rod_cislo)
                where p.meno = l.meno`
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPomerMuziZeny(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select trunc(zeny, 2) as zeny, trunc(100-zeny, 2) as muzi from
          (select count(case when (substr(os.rod_cislo, 3, 1)) in ('5','6') then 1 else null end)/count(*)*100 as zeny
              from os_udaje os join pacient p on(p.rod_cislo = os.rod_cislo)
              JOIN nemocnica using (id_nemocnice)
              JOIN zamestnanci using (id_nemocnice)
              WHERE cislo_zam = :cislo_zam)`,
      [cislo_zam]
    );
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertOsUdaje(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
      os_udaje_insert(:rod_cislo, :PSC, :meno, :priezvisko, :tel, :mail);
    END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      PSC: body.PSC,
      meno: body.meno,
      priezvisko: body.priezvisko,
      tel: body.tel,
      mail: body.mail,
    });

    console.log("Rows inserted " + result.rowsAffected);
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getOsobneUdaje,
  getMenovciPacientLekar,
  getPomerMuziZeny,
  insertOsUdaje,
};
