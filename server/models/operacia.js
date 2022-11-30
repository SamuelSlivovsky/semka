const database = require("../database/Database");

async function getOperacie() {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `SELECT * FROM operacia`,
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

async function getOperaciePocetLekarovTrvanie(pocetLekarov, trvanie) {
    try {
        let conn = await database.getConnection();
        const result = await conn.execute(
            `select datum, meno_pacienta, trvanie, lekari, id_operacie
                    from (select datum, pou.meno || ' ' || pou.priezvisko as meno_pacienta, trvanie, op.id_operacie, 
                            (select listagg(meno || ' ' || priezvisko, ', ') within group(order by priezvisko) 
                                from operacia_lekar ol join lekar l on(l.id_lekara = ol.id_lekara)
                                                            join zamestnanec z on(z.id_zamestnanca = l.id_zamestnanca)
                                                            join os_udaje lou on(lou.rod_cislo = z.rod_cislo) where ol.id_operacie = op.id_operacie) as lekari
                        from operacia_lekar ol join operacia op on(op.id_operacie = ol.id_operacie)
                                                join zdravotny_zaznam zz on(zz.id_zaznamu = op.id_zaznamu)
                                                join pacient p on(p.id_pacienta = zz.id_pacienta)
                                                join os_udaje pou on(pou.rod_cislo = p.rod_cislo)
                                group by datum, pou.meno, pou.priezvisko, trvanie, op.id_operacie
                            having count(id_lekara) > :pocet_lekarov and trvanie > :trvanie)
                        order by trvanie desc`, [pocetLekarov, trvanie]
        );

        return result.rows;

    } catch (err) {
        console.log(err);
    }
}

module.exports = {
    getOperacie,
    getOperaciePocetLekarovTrvanie
}