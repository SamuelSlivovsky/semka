const database = require("../database/Database");

async function getVehicles() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
          `SELECT nazov, ecv, typ_vozidla, 
                  to_char(priradenie, 'dd.mm.yyyy') as dat_priradenia, 
                  to_char(stk, 'dd.mm.yyyy') as dat_stk,
                  case when nvl(datom_do, add_months(sysdate, -1)) < sysdate then 1 end as volne
          FROM nemocnica
            JOIN vozidla using (id_nemocnice)
            LEFT JOIN vyjazdy using (ecv)
            LEFT JOIN plan_vyjazdov using (id_plan_vyjazdu)
          ORDER BY id_nemocnice ASC`
        );
    
        return result.rows;
      } catch (err) {
        throw new Error("Database error: " + err);
      }
}

module.exports = {
  getVehicles
}