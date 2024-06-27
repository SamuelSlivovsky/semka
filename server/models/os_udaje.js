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

async function getPomerMuziZeny(cislo_zam, rok) {
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
      `select trunc(zeny, 2) as zeny, trunc(100-zeny, 2) as muzi from
      (select count( DISTINCT case WHEN (SUBSTR(p.rod_cislo, 3, 1)) IN ('5', '6', '7', '8') 
                            THEN p.rod_cislo 
                        ELSE NULL  end)/count(distinct p.rod_cislo)*100 as zeny
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
${dateSelection})`,
      args
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
