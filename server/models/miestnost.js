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
    console.log(err);
  }
}

module.exports = {
  getMiestnosti,
  getDostupneMiestnosti,
};
