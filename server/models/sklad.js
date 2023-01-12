const database = require("../database/Database");

async function getSklady() {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(`SELECT * FROM sklad`);

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

async function getLiekyMenejAkoPocet(pocet) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `select n.nazov "Nemocnica", typ.nazov "Oddelenie",
                    l.nazov "Liek", sum(pocet_liekov) as "Počet lieku"
            from liek l join sarza sa on(l.id_lieku = sa.id_lieku)
                    join sklad sk on(sk.id_skladu = sa.id_skladu )
                    join oddelenie o on(o.id_oddelenia = sk.id_oddelenia)
                    join typ_oddelenia typ on (typ.id_typu_oddelenia = o.id_typu_oddelenia)
                    join nemocnica n on(n.id_nemocnice = o.id_nemocnice)
            group by n.nazov, typ.nazov,l.nazov
            having sum(pocet_liekov) < :pocet`,
      [pocet]
    );

    return result.rows;
  } catch (err) {
    throw new Error('Database error: ' + err);
  }
}

module.exports = {
  getSklady,
  getLiekyMenejAkoPocet,
};
