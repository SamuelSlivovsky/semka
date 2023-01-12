const database = require('../database/Database');

async function getOperacie() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`SELECT ID_PACIENTA, ID_ZAZNAMU, to_char(DATUM,'DD.MM.YYYY') as datum, TRVANIE, ID_OPERACIE, ID_MIESTNOSTI FROM zdravotny_zaznam
    JOIN operacia USING ( id_zaznamu )
    JOIN pacient USING ( id_pacienta )
    JOIN os_udaje USING ( rod_cislo )
    WHERE DATUM <= TO_DATE('01.08.2000') AND DATUM >= TO_DATE('01.06.2000') `);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getOperaciePocetLekarovTrvanie(pocetLekarov, trvanie) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select to_char(datum,'DD.MM.YYYY') "Dátum operácie", meno_pacienta "Pacient", trvanie "Trvanie", lekari "Lekári", id_operacie "Id operácie"
                    from (select datum, pou.meno || ' ' || pou.priezvisko as meno_pacienta, trvanie, op.id_operacie, 
                            (select listagg(meno || ' ' || priezvisko, ', ') within group(order by priezvisko) 
                                from operacia_lekar ol join lekar l on(l.id_lekara = ol.id_lekara)
                                                            join zamestnanec z on(z.id_zamestnanca = l.id_zamestnanca)
                                                            join os_udaje lou on(lou.rod_cislo = z.rod_cislo) where ol.id_operacie = op.id_operacie) as lekari
                        from operacia_lekar ol join operacia op on(op.id_operacie = ol.id_operacie)
                                                join zdravotny_zaznam zz on(zz.id_zaznamu = op.id_zaznamu)
                                                join pacient p on(p.id_pacienta = zz.id_pacienta)
                                                join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                group by datum, pou.meno, pou.priezvisko, trvanie, op.id_operacie
                            having count(id_lekara) > :pocet_lekarov and trvanie > :trvanie)
                        order by trvanie desc`,
      [pocetLekarov, trvanie]
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function insertOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `BEGIN
      operacia_insert(:rod_cislo , :priloha, :popis , :datum,  :id_miestnosti, :trvanie);
      END;`;

    let result = await conn.execute(sqlStatement, {
      rod_cislo: body.rod_cislo,
      priloha: body.priloha,
      popis: body.popis,
      datum: body.datum,
      id_miestnosti: body.id_miestnosti,
      trvanie: body.trvanie,
    });
    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function updateOperacia(body) {
  try {
    let conn = await database.getConnection();
    const sqlStatement = `update zdravotny_zaznam set datum = to_date(to_char(to_timestamp(:datum,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS')))
      where id_zaznamu = :id_zaznamu`;

    let result = await conn.execute(sqlStatement, {
      datum: body.datum,
      id_zaznamu: body.id_zaznamu,
    });
    console.log('Rows inserted ' + result.rowsAffected);
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getOperacie,
  getOperaciePocetLekarovTrvanie,
  insertOperacia,
  updateOperacia,
};
