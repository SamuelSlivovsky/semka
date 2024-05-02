const database = require('../database/Database');
const moment = require('moment');

async function getMiestnosti(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT distinct id_miestnosti FROM miestnost join oddelenie using (id_oddelenia)
    join zamestnanci using (id_oddelenia)
    join lozko on (lozko.id_miestnost = miestnost.id_miestnosti)
    where
     zamestnanci.cislo_zam = :id`,
      { id }
    );

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

async function getWardRoomsAvailability(hospitalId, roomsFrom) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `
      SELECT 
        m.id_miestnosti,
        m.kapacita,
        COUNT(pl.id_lozka) AS pocet_pacientov,
        m.je_muzska
      FROM 
        miestnost m
      LEFT JOIN 
        lozko l ON l.id_miestnost = m.id_miestnosti AND l.id_nemocnice = m.id_nemocnice
      LEFT JOIN 
        pacient_lozko pl ON pl.id_lozka = l.id_lozka AND pl.pobyt_do >= TO_DATE(:roomsFrom, 'DD.MM.YYYY HH24:MI')
      LEFT JOIN 
        pacient p ON p.id_pacienta = pl.id_pacienta
      LEFT JOIN 
        os_udaje ou ON ou.rod_cislo = p.rod_cislo
      WHERE 
        m.kapacita > 2
        AND m.id_nemocnice = :hospitalId
      GROUP BY 
        m.id_miestnosti, 
        m.kapacita,
        m.je_muzska
    `,
      {
        hospitalId: hospitalId,
        roomsFrom: roomsFrom
          ? moment(roomsFrom, 'DD.MM.YYYY HH:mm').format('DD.MM.YYYY HH:mm')
          : moment().format('DD.MM.YYYY HH:mm'),
      }
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

async function movePatientToAnotherRoom(
  bedIdFrom,
  bedIdTo,
  hospitalizedFrom,
  hospitalizedTo,
  dateWhenMove
) {
  try {
    if (!bedIdFrom || !bedIdTo || !hospitalizedFrom || !hospitalizedTo) {
      throw new Error('Invalid parameters for movePatientToAnotherRoom');
    }

    let conn = await database.getConnection();
    const sqlStatement = `
    BEGIN
      move_patient_to_another_room(:bedIdFrom, :bedIdTo, TO_DATE(:hospitalizedFrom, 'DD.MM.YYYY HH24:MI'), TO_DATE(:hospitalizedTo, 'DD.MM.YYYY HH24:MI'), TO_DATE(:dateWhenMove, 'DD.MM.YYYY HH24:MI'));
    END;`;

    await conn.execute(sqlStatement, {
      bedIdFrom: bedIdFrom,
      bedIdTo: bedIdTo,
      hospitalizedFrom: hospitalizedFrom,
      hospitalizedTo: hospitalizedTo,
      dateWhenMove: dateWhenMove,
    });

    console.log(`Patient moved from ${bedIdFrom} to ${bedIdTo}`);
  } catch (err) {
    console.log(err);
  }
}

module.exports = {
  getMiestnosti,
  getDostupneMiestnosti,
  getRoomsForHospital,
  getWardRoomsAvailability,
  movePatientToAnotherRoom,
};
