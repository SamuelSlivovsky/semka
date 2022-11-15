const database = require("../database/Database");
const oracleConnection = database.oracledb;
class Lekar {

    constructor() {
        console.log('Lekar vytvoreny');
        console.log(oracleConnection);
        this.x;
    }

    static makeObject() {
        if (!this.x) {
            this.x = new Lekar();
        }
        return this.x;
    }

    async getPacienti() {
        let conn = await oracleConnection.getConnection();
        const result = await conn.execute(
            `SELECT * FROM os_udaje join pacient using(rod_cislo) join lekar_pacient using(id_pacienta) where id_lekara = 1`,
        );

        console.log(result.rows);
        return result.rows;

    } catch(err) {
        console.log(err);
    }
}

module.exports = Lekar;