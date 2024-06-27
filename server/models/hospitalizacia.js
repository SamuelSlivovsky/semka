const database = require("../database/Database");

async function getHospitalizacie() {
  try {
    let conn = await database.getConnection();
    const result =
      await conn.execute(`SELECT rod_cislo, meno, priezvisko, datum, dat_do FROM hospitalizacia join zdravotny_zaznam using(id_zaznamu)
                                                                    join pacient using(id_pacienta)
                                                                    join os_udaje using(rod_cislo)`);

    return result.rows;
  } catch (err) {
    throw new Error("Database error: " + err);
    console.log(err);
  }
}

async function endHospitalization(body) {
  try {
    console.log(body);
    let conn = await database.getConnection();
    let isBefore = await conn.execute(
      `select case when to_date(to_char(to_timestamp(:dat_do, 'DD/MM/YYYY HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS')) >  
      to_date(to_char(to_timestamp(dat_od, 'DD/MM/YYYY HH24:MI:SS'), 'DD/MM/YYYY HH24:MI:SS'))
      then 1 else 0 end as isbefore from hospitalizacia
      where id_hosp = :id_hosp`,
      {
        dat_do: body.dat_do,
        id_hosp: body.id_hosp,
      }
    );
    if (isBefore.rows[0].ISBEFORE == 1) {
      await conn.execute(
        `update hospitalizacia set dat_do= :dat_do, prepustacia_sprava =:sprava where 
    id_hosp =:id_hosp`,
        {
          dat_do: body.dat_do,
          sprava: body.sprava,
          id_hosp: body.id_hosp,
        },
        { autoCommit: true }
      );
    } else {
      throw new Error("Dátum ukončenia nesmie byť pred dátumom začiatku");
    }
    console.log("success");
  } catch (err) {
    throw new Error(err);
  }
}

module.exports = {
  getHospitalizacie,
  endHospitalization,
};
