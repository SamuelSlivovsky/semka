const database = require("../database/Database");

async function getKonzilia(cislo_zam) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT id_konzilia, dovod, k.datum, id_zaznamu, zaverecna_sprava,
      meno, priezvisko, rod_cislo, popis, nazov, id_pacienta
      from konzilium k
                  JOIN zam_konzilium using (id_konzilia)
                  join zdravotny_zaz using (id_zaznamu)
                  join zdravotna_karta using (id_karty)
                  join pacient using (id_pacienta)
                  join os_udaje using (rod_cislo)
                  where cislo_zam =:cislo_zam `,
      { cislo_zam }
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function updateKonzilium(body) {
  console.log(body);
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `UPDATE KONZILIUM set zaverecna_sprava = :sprava where id_konzilia =:id_konzilia `,
      { id_konzilia: body.id_konzilia, sprava: body.sprava },
      { autoCommit: true }
    );
    console.log(result);
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertKonzilium(body) {
  try {
    let conn = await database.getConnection();
    await conn.execute(
      `begin konzilium_insert(:popis, :sprava, :id_zaznamu,:datum); end;`,
      {
        popis: body.popis,
        sprava: body.sprava,
        id_zaznamu: body.id_zaznamu,
        datum: body.datum,
      }
    );
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function insertKonziliumUser(body) {
  try {
    let conn = await database.getConnection();
    body.lekari.forEach((element) => {
      console.log(element);
      conn.execute(
        `begin zam_konzilium_insert(:cislo_zam, :id_zaznamu); end;`,
        {
          cislo_zam: element,
          id_zaznamu: body.id_zaznamu,
        }
      );
    });
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getKonzilia,
  updateKonzilium,
  insertKonzilium,
  insertKonziliumUser,
};
