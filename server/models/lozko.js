const database = require("../database/Database");

async function getLozka(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `SELECT DISTINCT 
      id_lozka, 
      typ_oddelenia,
      CASE 
      WHEN dat_od IS NOT NULL AND dat_od <= sysdate and (dat_do IS NULL OR dat_do >= sysdate) THEN 1 
          ELSE 0 
      END AS obsadene 
  FROM 
      (SELECT distinct id_lozka, o.typ_oddelenia, h.dat_do, h.id_hosp, h.dat_od
       FROM lozko l
       JOIN miestnost m ON m.id_miestnosti = l.id_miestnost
       JOIN oddelenie o USING (id_oddelenia)
       LEFT JOIN hospitalizacia h USING (id_lozka)
       WHERE id_miestnost = :id
       AND (dat_od is null OR (dat_od is not null and dat_od <= sysdate))
      ) sub
  WHERE 
      id_hosp IS NULL 
      OR NOT EXISTS (
          SELECT 1 FROM hospitalizacia h WHERE h.id_lozka = sub.id_lozka AND 
          (h.dat_do IS NULL or (h.dat_do is not null and h.dat_do >= sysdate))
      ) OR (dat_do is null or (dat_do is not null and dat_do >= sysdate))`,
      [id]
    );

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

async function getPacient(id) {
  try {
    let conn = await database.getConnection();
    const result = await conn.execute(
      `WITH RankedHospitalizations AS (
        SELECT 
            rod_cislo, 
            meno,
            priezvisko, 
            id_zaznamu,
            id_pacienta,
            hospitalizacia.dat_od,
            hospitalizacia.dat_do,
            ROW_NUMBER() OVER (PARTITION BY rod_cislo ORDER BY hospitalizacia.dat_od DESC) AS rn
        FROM 
            hospitalizacia
            JOIN zdravotny_zaz USING (id_zaznamu)
            JOIN zdravotna_karta USING (id_karty)
            JOIN pacient USING (id_pacienta)
            JOIN os_udaje USING (rod_cislo)
        WHERE 
            id_lozka = :id 
            AND hospitalizacia.dat_od <= SYSDATE  
            AND (hospitalizacia.dat_do IS NULL OR (hospitalizacia.dat_do > SYSDATE ))
    )
    SELECT 
        rod_cislo, 
        meno,
        priezvisko, 
        id_zaznamu,
        id_pacienta,
        dat_od,
        dat_do
    FROM 
        RankedHospitalizations
    WHERE 
        rn = 1
    `,
      [id]
    );
    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
  }
}

module.exports = {
  getLozka,
  getPacient,
};
