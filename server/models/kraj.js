const database = require("../database/Database");
const oracleConnection = database.oracledb;
class Kraj {

    constructor() {
        console.log('Kraj vytvoreny');
        console.log(oracleConnection);
        this.x;
    }

    static makeObject() {
        if (!this.x) {
            this.x = new Kraj();
        }
        return this.x;
    }

    async getAll() {
        let conn = await oracleConnection.getConnection();
        const result = await conn.execute(
            `SELECT * FROM kraj`,
        );

        console.log(result.rows);
        return result.rows;

    } catch(err) {
        console.log(err);
    }
}

module.exports = Kraj;