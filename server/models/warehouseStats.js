const database = require("../database/Database");
const {runInContext} = require("vm");

async function getMedAmount(id) {
    try {
        let conn = await database.getConnection();

        let result = null;
        let finalResult = [];

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(result.rows[0].ID_ODDELENIA === null) {
            //Getting amount of medications in warehouse
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and DATUM_DODANIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of finished orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and DATUM_DODANIA is not null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of confirmed orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Prijata'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of declined orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Zamietnuta'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of requested orders for department
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = SKLAD.ID_ODDELENIA
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

        } else {
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and DATUM_DODANIA is null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of finished orders
            sqlStatement = `select count(*) AS POCET from OBJEDNAVKA join SKLAD on OBJEDNAVKA.ID_SKLAD = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and DATUM_DODANIA is not null`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of waiting orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of confirmed orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Prijata'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of declined orders
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_SKLAD_OBJ = SKLAD.ID_SKLAD
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Zamietnuta'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);

            //Getting amount of requested orders for department
            sqlStatement = `select count(*) AS POCET from PRESUN_LIEKOV
                    join SKLAD on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = SKLAD.ID_ODDELENIA
                    join NEMOCNICA on SKLAD.ID_NEMOCNICE = SKLAD.ID_NEMOCNICE
                    join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                    where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id)  and STATUS like 'Cakajuca'`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
            finalResult.push(result.rows[0]);
        }

        return finalResult;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getMedications(id){
    try {
        let conn = await database.getConnection();

        let result = null;

        let sqlStatement = `select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        result = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if (result.rows[0].ID_ODDELENIA === null) {
            sqlStatement = `select unique(LIEK.NAZOV) AS NAZOV, TRVANLIVOST_LIEKU.ID_LIEK AS ID_LIEK from LIEK
                join TRVANLIVOST_LIEKU on LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
                join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA is null and POCET > 0 order by ID_LIEK`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        } else {
            sqlStatement = `select unique(LIEK.NAZOV) AS NAZOV, TRVANLIVOST_LIEKU.ID_LIEK AS ID_LIEK from LIEK
                join TRVANLIVOST_LIEKU on LIEK.ID_LIEK = TRVANLIVOST_LIEKU.ID_LIEK
                join SKLAD on TRVANLIVOST_LIEKU.ID_SKLAD = SKLAD.ID_SKLAD
                join NEMOCNICA on SKLAD.ID_NEMOCNICE = NEMOCNICA.ID_NEMOCNICE
                join ZAMESTNANCI on NEMOCNICA.ID_NEMOCNICE = ZAMESTNANCI.ID_NEMOCNICE
                where CISLO_ZAM = :usr_id and SKLAD.ID_ODDELENIA = (select ID_ODDELENIA from ZAMESTNANCI where CISLO_ZAM = :usr_id) and POCET > 0`;
            result = await conn.execute(sqlStatement, {
                usr_id: id
            });
        }

        return result.rows;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

async function getMedStats(id, med_id) {
    try {
        let conn = await database.getConnection();

        let sqlStatement = null, result = null, department = null, medSum = null, orders = null, receivedTransfers = null;
        let outgoingTransfers = null;
        let medication = parseInt(med_id);

        sqlStatement = `select ID_ODDELENIA, ID_NEMOCNICE from ZAMESTNANCI where CISLO_ZAM = :usr_id`;
        department = await conn.execute(sqlStatement, {
            usr_id: id
        });

        if(department.rows[0].ID_ODDELENIA === null) {
            //Employee is from central warehouse

            //Getting current amount of medications
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join sklad on 
                            TRVANLIVOST_LIEKU.ID_SKLAD = sklad.ID_SKLAD
                            where ID_ODDELENIA is null
                            and ID_NEMOCNICE = :id_n
                            and ID_LIEK = :id_l`;
            medSum = await conn.execute(sqlStatement, {
                id_n: department.rows[0].ID_NEMOCNICE,
                id_l: med_id
            });

            //Getting all orders in past 6 months
            sqlStatement = `select DATUM_DODANIA, to_char(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from OBJEDNAVKA join sklad on OBJEDNAVKA.ID_SKLAD = sklad.ID_SKLAD
                            where ID_NEMOCNICE = :id_n
                            and ID_ODDELENIA is null
                            AND DATUM_DODANIA > ADD_MONTHS(SYSDATE, -6)
                            order by DATUM_DODANIA desc`;
            orders = await conn.execute(sqlStatement, {
                id_n: department.rows[0].ID_NEMOCNICE
            });

            orders = orders.rows.map(order => {
                const { DATUM_DODANIA, ZOZNAM_LIEKOV } = order;
                try {
                    const jsonArray = JSON.parse(ZOZNAM_LIEKOV);
                    const jsonArrayArray = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
                    const filteredData = jsonArrayArray.filter(item => item.id === medication);
                    if (filteredData.length > 0) {
                        return { DATUM_DODANIA, filteredData };
                    }
                } catch (error) {
                    console.error('Error parsing ZOZNAM_LIEKOV:', error);
                }
                return null;
            }).filter(Boolean);

            orders = orders.filter(order => order !== undefined);

            //Getting all incoming transfers for past 6 months
            sqlStatement = `select DATUM_PRESUNU, to_char(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from PRESUN_LIEKOV join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
                            where ID_NEMOCNICE = :id_n
                            and ID_ODDELENIA is null
                            AND DATUM_PRESUNU > ADD_MONTHS(SYSDATE, -6)
                            order by DATUM_PRESUNU desc`;
            receivedTransfers = await conn.execute(sqlStatement, {
                id_n: department.rows[0].ID_NEMOCNICE,
            });

            receivedTransfers = receivedTransfers.rows.map(order => {
                const { DATUM_PRESUNU, ZOZNAM_LIEKOV } = order;
                try {
                    const jsonArray = JSON.parse(ZOZNAM_LIEKOV);
                    const jsonArrayArray = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
                    const filteredData = jsonArrayArray.filter(item => item.id === medication);
                    if (filteredData.length > 0) {
                        return { DATUM_PRESUNU, filteredData };
                    }
                } catch (error) {
                    console.error('Error parsing ZOZNAM_LIEKOV:', error);
                }
                return null;
            }).filter(Boolean);

            receivedTransfers = receivedTransfers.filter(order => order !== undefined);

        } else {
            //Employee is from hospital department

            //Getting current amount of medication
            sqlStatement = `select SUM(POCET) AS POCET from TRVANLIVOST_LIEKU join sklad on 
                            TRVANLIVOST_LIEKU.ID_SKLAD = sklad.ID_SKLAD
                            where ID_ODDELENIA = :id_o
                            and ID_NEMOCNICE = :id_n
                            and ID_LIEK = :id_l`;
            medSum = await conn.execute(sqlStatement, {
                id_o: department.rows[0].ID_ODDELENIA,
                id_n: department.rows[0].ID_NEMOCNICE,
                id_l: med_id
            });

            //Getting all orders in past 6 months
            sqlStatement = `select DATUM_DODANIA, to_char(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from OBJEDNAVKA join sklad on OBJEDNAVKA.ID_SKLAD = sklad.ID_SKLAD
                            where ID_NEMOCNICE = :id_n
                            and ID_ODDELENIA = :id_o
                            AND DATUM_DODANIA > ADD_MONTHS(SYSDATE, -6)
                            order by DATUM_DODANIA desc`;
            orders = await conn.execute(sqlStatement, {
                id_n: department.rows[0].ID_NEMOCNICE,
                id_o:  department.rows[0].ID_ODDELENIA
            });

            orders = orders.rows.map(order => {
                const { DATUM_DODANIA, ZOZNAM_LIEKOV } = order;
                try {
                    const jsonArray = JSON.parse(ZOZNAM_LIEKOV);
                    const jsonArrayArray = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
                    const filteredData = jsonArrayArray.filter(item => item.id === medication);
                    if (filteredData.length > 0) {
                        return { DATUM_DODANIA, filteredData };
                    }
                } catch (error) {
                    console.error('Error parsing ZOZNAM_LIEKOV:', error);
                }
                return null;
            }).filter(Boolean);

            orders = orders.filter(order => order !== undefined);

            //Getting all incoming transfers in past 6 months
            sqlStatement = `select DATUM_PRESUNU, to_char(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from PRESUN_LIEKOV join sklad on PRESUN_LIEKOV.ID_SKLAD_OBJ = sklad.ID_SKLAD
                            where ID_NEMOCNICE = :id_n
                            and ID_ODDELENIA = :id_o
                            AND DATUM_PRESUNU > ADD_MONTHS(SYSDATE, -6)
                            order by DATUM_PRESUNU desc`;
            receivedTransfers = await conn.execute(sqlStatement, {
                id_o: department.rows[0].ID_ODDELENIA,
                id_n: department.rows[0].ID_NEMOCNICE
            });

            receivedTransfers = receivedTransfers.rows.map(order => {
                const { DATUM_PRESUNU, ZOZNAM_LIEKOV } = order;
                try {
                    const jsonArray = JSON.parse(ZOZNAM_LIEKOV);
                    const jsonArrayArray = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
                    const filteredData = jsonArrayArray.filter(item => item.id === medication);
                    if (filteredData.length > 0) {
                        return { DATUM_PRESUNU, filteredData };
                    }
                } catch (error) {
                    console.error('Error parsing ZOZNAM_LIEKOV:', error);
                }
                return null;
            }).filter(Boolean);

            receivedTransfers = receivedTransfers.filter(order => order !== undefined);

            //Getting all outgoing transfers in past 6 months
            sqlStatement = `select DATUM_PRESUNU, to_char(ZOZNAM_LIEKOV) AS ZOZNAM_LIEKOV from PRESUN_LIEKOV join sklad on PRESUN_LIEKOV.ID_ODDELENIA_LIEKU = sklad.ID_ODDELENIA
                            where ID_NEMOCNICE = :id_n
                            and ID_ODDELENIA = :id_o
                            AND DATUM_PRESUNU > ADD_MONTHS(SYSDATE, -6)
                            order by DATUM_PRESUNU desc`;
            outgoingTransfers = await conn.execute(sqlStatement, {
                id_o: department.rows[0].ID_ODDELENIA,
                id_n: department.rows[0].ID_NEMOCNICE
            });

            outgoingTransfers = outgoingTransfers.rows.map(order => {
                const { DATUM_PRESUNU, ZOZNAM_LIEKOV } = order;
                try {
                    const jsonArray = JSON.parse(ZOZNAM_LIEKOV);
                    const jsonArrayArray = Array.isArray(jsonArray) ? jsonArray : [jsonArray];
                    const filteredData = jsonArrayArray.filter(item => item.id === medication);
                    if (filteredData.length > 0) {
                        return { DATUM_PRESUNU, filteredData };
                    }
                } catch (error) {
                    console.error('Error parsing ZOZNAM_LIEKOV:', error);
                }
                return null;
            }).filter(Boolean);

            outgoingTransfers = outgoingTransfers.filter(order => order !== undefined);

        }

        let finalArray = [6];
        let previousAmount = 0;
        let previousAmountArray = [6];
        let previousChangeArray = [6];
        let monthsArray = [6];
        let currentDate = new Date();
        //let firstVal = [0, 9999999999];
        //let secondVal = [0, 9999999999];

        for (let index = 0; index < 7; index++) {
            let targetMonth = currentDate.getMonth() - index;

            let targetYear = currentDate.getFullYear();
            if (targetMonth < 0) {
                targetMonth += 12;
                targetYear--;
            }

            let targetDate = new Date(targetYear, targetMonth);

            monthsArray[index] = targetDate.toLocaleString('default', { month: 'long' });

            let filteredOrders = orders.filter(order => {
                let orderMonth = order.DATUM_DODANIA.getMonth();
                let orderYear = order.DATUM_DODANIA.getFullYear();
                return orderYear === targetYear && orderMonth === targetMonth;
            });

            let filteredTransfers = receivedTransfers.filter(transfer => {
                let orderMonth = transfer.DATUM_PRESUNU.getMonth();
                let orderYear = transfer.DATUM_PRESUNU.getFullYear();
                return orderYear === targetYear && orderMonth === targetMonth;
            });

            for (const order of filteredOrders) {
                previousAmount += order.filteredData[0].amount;
            }

            for(const transfer of filteredTransfers) {
                previousAmount += transfer.filteredData[0].amount;
            }

            if(outgoingTransfers !== null) {
                let filteredOutgoingTransfers = outgoingTransfers.filter(transfer => {
                    let orderMonth = transfer.DATUM_PRESUNU.getMonth();
                    let orderYear = transfer.DATUM_PRESUNU.getFullYear();
                    return orderYear === targetYear && orderMonth === targetMonth;
                });

                for(const transfer of filteredOutgoingTransfers) {
                    previousAmount -= transfer.filteredData[0].amount;
                }

            }

            previousAmountArray[index] = previousAmount;

            /*if(previousAmount > firstVal[0]) {
                firstVal[0] = previousAmount;
            }

            if (previousAmount < firstVal[1]) {
                firstVal[1] = previousAmount;
            }*/

        }

        let avgDepletion = 0;
        previousAmountArray[0] = medSum.rows[0].POCET;

        for (let i = previousAmountArray.length; i > 0; i--) {
            previousChangeArray[i - 1] = previousAmountArray[i] - previousAmountArray[i - 1];

            /*if(previousChangeArray[i - 1] > secondVal[0]) {
                secondVal[0] = previousChangeArray[i - 1];
            }

            if (previousChangeArray[i - 1] < secondVal[1]) {
                secondVal[1] = previousChangeArray[i - 1];
            }*/
        }
        previousChangeArray[6] = 0;

        for (let i = 0; i < previousChangeArray.length; i++) {
            avgDepletion += previousChangeArray[i];
        }

        finalArray[0] = previousAmountArray.reverse();
        finalArray[1] = previousChangeArray.reverse();
        finalArray[2] = avgDepletion / 6;
        finalArray[3] = monthsArray.reverse();
        //finalArray[4] = firstVal;
        //finalArray[5] = secondVal;

        return finalArray;
    } catch (err) {
        throw new Error("Database error: " + err);
    }
}

module.exports = {
    getMedAmount,
    getMedications,
    getMedStats
};