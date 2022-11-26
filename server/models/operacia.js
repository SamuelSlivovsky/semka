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
    console.log(err);
  }
}

module.exports = {
  getOperacie,
};
