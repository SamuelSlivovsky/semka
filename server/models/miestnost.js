const database = require('../database/Database');

async function getMiestnosti() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM miestnost`);

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getRoomsForHospital(hospitalId) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
        * 
      FROM 
        miestnost
      WHERE 
        id_nemocnice = :hospitalId
    `,
      {
        hospitalId: hospitalId,
      }
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getWardRoomsAvailability() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
          m.id_miestnosti,
          m.kapacita,
          COUNT(pl.id_lozka) AS pocet_pacientov
      FROM 
          miestnost m
      LEFT JOIN 
          lozko l ON l.id_miestnost = m.id_miestnosti AND l.id_nemocnice = m.id_nemocnice
      LEFT JOIN 
          pacient_lozko pl ON pl.id_lozka = l.id_lozka
      LEFT JOIN 
          pacient p ON p.id_pacienta = pl.id_pacienta
      LEFT JOIN 
          os_udaje ou ON ou.rod_cislo = p.rod_cislo
      WHERE 
          m.kapacita > 2
      GROUP BY 
          m.id_miestnosti, 
          m.kapacita
    `
    );

    return result.rows;
  } catch (err) {
    console.log(err);
  }
}

async function getDostupneMiestnosti(id_oddelenia, trv, dat_od) {
  try {
    const durat = (1 / 1440) * trv;
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select id_miestnosti, nazov_miestnosti from miestnost 
                where (id_miestnosti in
                (select id_miestnosti from operacia
                                    join zdravotny_zaznam using(id_zaznamu)
                                        where ( to_date(to_char(to_timestamp(:dat_od,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS'))+(:durat) < datum+(1/1440*trvanie)
                                        AND  to_date(to_char(to_timestamp(:dat_od,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS')) < datum) OR(
                                        to_date(to_char(to_timestamp(:dat_od,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS'))+(:durat) > datum+(1/1440*trvanie)
                                       AND  to_date(to_char(to_timestamp(:dat_od,'DD/MM/YYYY HH24:MI:SS'),'DD/MM/YYYY HH24:MI:SS')) > datum) )
                  OR id_miestnosti not in(select id_miestnosti from operacia))            
                and id_oddelenia = :id_oddelenia and id_typu_miestnosti = 2
                order by id_miestnosti`,
      [dat_od, durat, dat_od, dat_od, durat, dat_od, id_oddelenia]
    );
    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getMiestnosti,
  getDostupneMiestnosti,
  getRoomsForHospital,
  getWardRoomsAvailability,
};
