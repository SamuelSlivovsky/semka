const xmlsql = `select XMLRoot(XMLElement("nemocnica", 
XMLElement("nazov_nemocnice", nazov_nemocnice),
XMLElement("hospitalizacie", hospitalizacie)
), version '1.0'
).getclobval()
from (select (select XMLAgg(XMLElement("hospitalizacia",
                   XMLElement("datum_hospitalizacie", zz.datum),
                   XMLElement("datum_ukoncenia", h.dat_do),
                   XMLElement("pacient", XMLAttributes(pks.krvna_skupina as "typ_krvnej_skupiny",
                                              pou.rod_cislo as "rodne_cislo"),
                                         XMLElement("meno", pou.meno || ' ' || pou.priezvisko)
                              ),
                   XMLElement("lekar",
                              XMLElement("meno", lou.meno || ' ' || lou.priezvisko)
                              ),
                   XMLElement("sestricka",
                              XMLElement("meno", sou.meno || ' ' || sou.priezvisko)
                              ),     
                   XMLElement("miestnost", XMLAttributes(m.nazov_miestnosti as "nazov"), 
                              XMLElement("lozko", XMLAttributes(h.id_lozka as "id"))
                              )                        
                   )
        ) from hospitalizacia h join lozko loz on(loz.id_lozka = h.id_lozka)
                                 join miestnost m on(m.id_miestnosti = loz.id_miestnosti)
                                  join sestricka s on(s.id_sestricky = h.id_sestricky)
                                   join zamestnanec zs on(zs.id_zamestnanca = s.id_zamestnanca)
                                    join os_udaje sou on(sou.rod_cislo = zs.rod_cislo)
                                     join lekar l on(l.id_lekara = h.id_lekara)
                                      join zamestnanec zl on(zl.id_zamestnanca = l.id_zamestnanca)
                                       join os_udaje lou on(lou.rod_cislo = zl.rod_cislo)
                                        join zdravotny_zaznam zz on(zz.id_zaznamu = h.id_zaznamu)
                                         join pacient p on(p.id_pacienta = zz.id_pacienta)
                                          join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                           join krvna_skupina pks on(pks.id_typu_krvnej_skupiny = p.id_typu_krvnej_skupiny) 
                                            join oddelenie od on(od.id_oddelenia = m.id_oddelenia)
                                             join nemocnica nem on(nem.id_nemocnice = od.id_nemocnice)
                                              where nem.id_nemocnice = nem_out.id_nemocnice
                                               group by nem.id_nemocnice
) as hospitalizacie, nem_out.nazov as nazov_nemocnice from nemocnica nem_out where nem_out.id_nemocnice = 1);`


const port = 5000;

const express = require("express");
//ROUTES
const krajeRoute = require("./routes/KrajeRoute");
const lekarRoute = require("./routes/LekarRoute");

const database = require("./database/Database");

const app = express();
app.use(express.json());


app.use("/kraje", krajeRoute);
app.use("/lekar", lekarRoute);


const oracledb = database.oracledb;

const sqlStatement = `BEGIN
    get_pacient_json(1, :ret);
END;`;

async function testJSON() {
    try {
        var bindvars = {
            ret: { dir: oracledb.BIND_OUT, type: oracledb.JSON }
        };
        const conn = await database.getConnection();
        let json = await conn.execute(sqlStatement, bindvars)
        console.log(json.outBinds.ret);
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}
//testJSON();

const sqlStatement2 = `BEGIN
    :ret := getxml_f();
END;`;

oracledb.fetchAsString = [ oracledb.CLOB ];

async function testXML() {
    try {
        const conn = await database.getConnection();
        let xml = await conn.execute(sqlStatement2, {
            ret: { dir: oracledb.BIND_OUT, type: oracledb.STRING, maxSize: 1073741824 }
        })
        console.log(xml.outBinds.ret);
    } catch (err) {
        console.error(err);

        process.exit(1); // Non-zero failure code
    }
}
testXML();

app.listen(port, () => {
    console.log(`Aplikacia bezi na porte ${port}`);
})